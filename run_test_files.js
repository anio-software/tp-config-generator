const fs = require("fs")
const path = require("path")
const {spawnSync} = require("child_process")

function isDir(p) {
	const stat = fs.statSync(p)

	return stat.isDirectory()
}

function findTestFiles(dir, ret) {
	const entries = fs.readdirSync(dir)

	for (const entry of entries) {
		const entry_path = path.resolve(dir, entry)

		if (isDir(entry_path)) {
			findTestFiles(entry_path, ret)
		} else if (entry_path.slice(-8) === ".test.js") {
			ret.push(entry_path)
		}
	}

	return ret
}

let test_files = []

findTestFiles(path.resolve(__dirname, "test"), test_files)

spawnSync(
	"./node_modules/.bin/mocha", test_files, {
		stdio: "inherit",
		cwd: __dirname
	}
)
