const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
admin.initializeApp();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const storage = admin.storage();
const bucket = storage.bucket();

exports.processNode = functions.firestore
    .document('reasoning_nodes/{nodeId}')
    .onCreate(async (snap, context) => {
        const node = snap.data();
        const nodeRef = snap.ref;

        try {
            // Step 1: Decompose the problem
            const decomposition = await decomposeProblem(node.question, node.type);

            // Step 2: Create child nodes
            const children = await createChildNodes(node, decomposition);

            // Step 3: Update parent node
            await nodeRef.update({
                children: children.map(child => child.id),
                status: 'processed',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Step 4: Store large responses in Storage
            if (JSON.stringify(node).length > 100000) {
                const file = bucket.file(`nodes/${context.params.nodeId}.json`);
                await file.save(JSON.stringify(node));
                await nodeRef.update({ storagePath: file.name });
            }

        } catch (error) {
            await nodeRef.update({
                status: 'error',
                error: error.message
            });
        }
    });

async function decomposeProblem(question, type) {
    const prompt = getPromptByType(type, question);
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
    });
    return parseResponse(response.choices[0].message.content, type);
}

function getPromptByType(type, question) {
    const prompts = {
        'TV Series': `Break down "${question}" into 5 seasons with episode outlines. Respond in JSON format.`,
        'Academic Program': `Create a curriculum structure for "${question}". Include courses and modules. Respond in JSON.`,
        'Research Project': `Divide "${question}" into research phases with objectives and methods. Use JSON format.`,
        default: `Decompose "${question}" into 3-5 sub-tasks. Respond as a numbered list.`
    };
    return prompts[type] || prompts.default;
}

function parseResponse(response, type) {
    if (type === 'TV Series' || type === 'Academic Program') {
        return JSON.parse(response);
    }
    return response.split('\n').filter(line => line.trim());
}

async function createChildNodes(parentNode, decomposition) {
    const batch = admin.firestore().batch();
    const children = [];

    decomposition.forEach((item, index) => {
        const childRef = admin.firestore().collection('reasoning_nodes').doc();
        const childNode = {
            question: item.title || item,
            parentId: parentNode.id,
            type: getChildType(parentNode.type),
            depth: parentNode.depth + 1,
            status: 'new',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        batch.set(childRef, childNode);
        children.push({ id: childRef.id, ...childNode });
    });

    await batch.commit();
    return children;
}

function getChildType(parentType) {
    const typeHierarchy = {
        'TV Series': 'Season',
        'Season': 'Episode',
        'Episode': 'Act',
        'Academic Program': 'Course',
        'Course': 'Module',
        'Research Project': 'Phase'
    };
    return typeHierarchy[parentType] || 'Sub-task';
}  