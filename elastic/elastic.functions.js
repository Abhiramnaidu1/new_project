const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

 function createTitle() {
    const { response } = await client.create({
        index: 'data',
        id: 11,
        body: {
            title: 'My First title',
            author: 'Jaseem',
            date: new Date()
        }
    });
}

// createTitle().catch(console.log);
 function getTitle() {
    const { body } = await client.get({
        index: 'data',
        id: 11
    });

    console.log(body);
}

// getTitle().catch(console.log);

 function updateTitle() {
    const { response } = await client.update({
        index: 'data',
        id: 11,
        body: {
            doc: {
                title: 'Awsome title'
            }
        }
    });
}



const body = titles.flatMap((doc, index) => [
    { index: { _index: 'data', _id: index + 1 } },
    doc
]);

function createTitles() {
    const { response } = await client.bulk({ body: body, refresh: true });

    if (response) {
        console.log(response.errors);
    }
}

// createTitles().catch(console.log);

function countTitles() {
    const { body } = await client.count({
        index: 'data'
    });

    console.log(body);
}

// countTitles().catch(console.log);

function searchTitles() {
    const { body: response } = await client.search({
        index: 'data',
        body: {
            query: {
                match: {
                    title: titlename
                }
            }
        }
    });

    console.log(response.hits.hits);
}

searchTitles().catch(console.log);
