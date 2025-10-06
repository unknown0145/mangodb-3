const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const variantSchema = new mongoose.Schema({
    color: String,
    size: String,
    stock: Number
})

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    variants: [variantSchema]
})

const Product = mongoose.model('Product', productSchema)

async function runCatalog() {
    try {
        // Insert sample products
        await Product.deleteMany({}) // clear existing data

        await Product.insertMany([
            {
                name: "T-Shirt",
                price: 500,
                category: "Clothing",
                variants: [
                    { color: "Red", size: "M", stock: 10 },
                    { color: "Blue", size: "L", stock: 5 }
                ]
            },
            {
                name: "Sneakers",
                price: 2500,
                category: "Footwear",
                variants: [
                    { color: "White", size: "42", stock: 7 },
                    { color: "Black", size: "43", stock: 3 }
                ]
            }
        ])

        console.log("Sample products inserted!")

        // 1. Retrieve all products
        const allProducts = await Product.find()
        console.log("All Products:", allProducts)

        // 2. Filter products by category
        const clothingProducts = await Product.find({ category: "Clothing" })
        console.log("Clothing Products:", clothingProducts)

        // 3. Project specific variant details (e.g., only color and stock)
        const variantsProjection = await Product.find({}, { name: 1, "variants.color": 1, "variants.stock": 1 })
        console.log("Variants Projection:", variantsProjection)

    } catch (err) {
        console.log(err)
    } finally {
        mongoose.connection.close()
    }
}

runCatalog()