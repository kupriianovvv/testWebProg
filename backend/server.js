const fs = require("fs/promises");
const path = require("path")
const express = require("express");
const cors = require("cors")

//const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8")

const app = express();

app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
	const data = await fs.readFile(path.join(__dirname, "data.json"), "utf-8");
	const parsedData = JSON.parse(data)
	console.log(parsedData)
	res.json(parsedData);
})

app.post("/", async (req, res) => {
	const data = await fs.readFile(path.join(__dirname, "data.json"), "utf-8");
	const parsedData = JSON.parse(data)

	const id = Number(req.body.id);
	const duplicate = parsedData.find(item => item.id === id);
	if (duplicate) {
		res.status(403).json({"error" : "duplicate"})
		return
	}

	console.log(req.body)
	parsedData.push(req. body);
	await fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(parsedData))
	res.json(req.body)
})

app.delete("/:id", async (req, res) => {
	const data = await fs.readFile(path.join(__dirname, "data.json"), "utf-8");
	const parsedData = JSON.parse(data)

	const id  = Number(req.params.id);
	const item = parsedData.find(item => item.id === id)
	if (!item) {
		res.status(404).json({"error": "No item with such id"})
		return
	}

	const filteredData = parsedData.filter(item => item.id !== id)

	await fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(filteredData))
	res.json(item);
})

app.put("/:id", async (req, res) => {
	const data = await fs.readFile(path.join(__dirname, "data.json"), "utf-8");
	const parsedData = JSON.parse(data)
	const id = Number(req.params.id)
	const item = parsedData.find(item => item.id === id)
	if (!item) {
		res.status(404).json({ "error": "Not found" })
		return;
	}


	const newData = parsedData.map(item => {
		if (item.id !== id) {
			return item
		} else {
			if (req.body.name) {
				item.name = req.body.name
			}
			if (req.body.power === 0 || req.body.power) {
				item.power = req.body.power
			}
			return item
		}
	})
	await fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(newData))
	res.json(item)

})

app.listen(3000, () => console.log("listening PORT 3000"))