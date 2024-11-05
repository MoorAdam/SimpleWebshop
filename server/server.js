import express from 'express';
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const dataFilePath = join(__dirname, 'products.json');

app.get('/favicon.ico', (req, res) => res.status(204));

app.use(express.json());

app.use('/static', express.static(join(__dirname, '..', 'client')));

app.get('/products/all', (req, res) => {
    res.sendFile(join(__dirname, '..', 'client', 'site.html'));
})

app.get('/products/manager', (req, res) => {
    res.sendFile(join(__dirname, '..', '/client/manager', 'product-manager.html'));
})

app.get('/api/products/all', async (req, res) => {
    const rawData = await readFile(join(__dirname, 'products.json'), 'utf8');
    const productData = JSON.parse(rawData);
    res.json({ products: productData.products });
});

app.post('/api/products/', async (req, res) => {

    try {

        const newProduct = req.body;
        console.log("Trying to add product with data: " + newProduct)
        const rawData = await readFile(join(__dirname, 'products.json'), 'utf8');
        const { products } = await JSON.parse(rawData);
        newProduct["id"] = getNewId(products);
        products.push(newProduct);

        writeFile(join(__dirname, 'products.json'), JSON.stringify({ "products": products }))

        return res.send({ state: "DONE" });

    } catch (error) {
        console.log("ERROR: "+error);
        return res.send({ state: "ERROR" });
    }


})

app.delete('/api/products/:id', async (req, res) => {

    try {
        console.log("starting");
        const id = Number.parseInt(req.params.id);
        console.log("Trying to delete product with data: " + id)
        const rawData = await readFile(join(__dirname, 'products.json'), 'utf8');
        const { products } = await JSON.parse(rawData);

        const filteredProducts = products.filter(i => i.id !== id)



        writeFile(join(__dirname, 'products.json'), JSON.stringify({ "products": filteredProducts }))

        console.log("sending response");

        return res.send({ state: "DONE" });

    } catch (error) {
        console.log("ERROR: "+error);
        return res.send({ state: "ERROR" });
    }


})

app.patch('/api/products/:id', async (req, res) => {

    try {
        console.log("starting");
        const id = Number.parseInt(req.params.id);
        const editedProduct = req.body;

        console.log(req.body);

        console.log("Trying to patch product with data: " + id)
        const rawData = await readFile(join(__dirname, 'products.json'), 'utf8');
        const { products } = await JSON.parse(rawData);

        const editProductIndex = products.findIndex(p => p.id === id);

        console.log("edited: "+editProductIndex);

        editedProduct.id = id;

        products[editProductIndex] = editedProduct;

        writeFile(join(__dirname, 'products.json'), JSON.stringify({ "products": products }))

        return res.send({ state: "DONE" });

    } catch (error) {
        console.log("ERROR: "+error);
        return res.send({ state: "ERROR" });
    }


})

function getNewId(products) {
    const productIds = products.map(user => user.id);
    const maxId = Math.max(...productIds);
    return maxId + 1;
}


app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}/products/all`);
})