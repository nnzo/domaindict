const dns = require('dns');
var fs = require('fs');

let listOfHostnames = []

async function main() {
    var array = fs.readFileSync('dict.txt').toString().split("\n");
    for (i in array) {
        listOfHostnames.push(array[i])
    }

    function exists(hostname) {
        return new Promise((resolve) => {
            dns.lookup(hostname, (error) => resolve({ hostname, exists: !error }));
        })
    }

    let total = 0
    let ava = 0

    Promise.all(listOfHostnames.map((item, i) => {
        return new Promise((resolve) => {
            exists(item).then((result) => {
                console.log(`${result.exists ? '💔' : '💚'} ${i}, ${result.hostname}`)
                total++
                if(!result.exists) { ava++ }
                resolve()
            })
        })
    })).then(() => {
        console.log(`Finished with ${total} domains, ${ava} of them are free.`)
    })
}

main()