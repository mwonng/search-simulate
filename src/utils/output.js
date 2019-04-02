const inquirer = require('inquirer');

const output = {
    line: (message) => {
        console.log(message);
    },

    /**
     * If results are too many, show record by paginator. default setting on ./setting.json
     * @param {Array} records
     * @param {Int} countPerPage
     * @param {Function} recodesPrintfunc
     */
    pagenatePrint: async (records, countPerPage, recodesPrintfunc) => {
        let currentPage = 1;
        let maxIndex = records.length;
        let lastPage = Math.ceil(maxIndex / countPerPage);

        while (currentPage <= lastPage) {
            for (let i = (currentPage - 1) * countPerPage; i < currentPage * countPerPage && i < maxIndex; i++) {
                output.line(`-------> Result: ${i + 1}/${maxIndex} <--------     `);
                recodesPrintfunc(records[i]);
            }
            if (currentPage < lastPage) {
                const userInput = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'continue',
                        message: `page ${currentPage}/ ${lastPage}, press 'Enter' to next page, press 'q' or 'ctrl + c' to exit:`
                    }
                ]);
                if (userInput.continue === 'q') {
                    process.exit(1);
                }
            }
            currentPage++;
        }
    },

    readableAttrPrint: (currentRecord) => {
        Object.keys(currentRecord).forEach(key => {
            let line = output.readableLine(key, currentRecord[key]);
            output.line(line);
        });
    },

    readableLine: (key, value) => {
        if (Array.isArray(value)) {
            value = JSON.stringify(value);
        } else {
            value = value.toString();
        }
        return key.padEnd(30) + value.toString().padEnd(50);
    },
};

module.exports = output;