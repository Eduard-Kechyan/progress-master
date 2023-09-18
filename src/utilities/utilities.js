const UTIL = {
    getDate: () => {
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }

        return day + "." + month + "." + year;
    },
    getFullDate: () => {
        let date = new Date();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }

        return day + "." + month + "." + year + "_" + hours + ":" + minutes;
    },
    downloadFile: (content, fileName, type) => {
        var a = document.createElement("a");
        var file = new Blob([content], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    },
    readFile: (event) => {
        return new Promise((resolve, reject) => {
            let file = event.target.files[0];
            if (!file) {
                reject();
            }
            let reader = new FileReader();
            reader.onload = (e) => {
                let contents = e.target.result;
                resolve(contents);
            };
            reader.readAsText(file);
        })
    },
    mergeArrays: (a, b, predicate = (a, b) => a === b) => {
        const c = [...a];
        b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
        return c;
    },
    round: (value) => {
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(value * multiplier) / multiplier;
    }
};

export default UTIL;