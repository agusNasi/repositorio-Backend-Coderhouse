const logCyan = (data) => console.log("\x1b[36m%s\x1b[0m", data);
const logYellow = (data) => console.log("\x1b[33m%s\x1b[0m", data);
const logGreen = (data) => console.log("\x1b[32m%s\x1b[0m", data);
const logRed = (data) => console.log("\x1b[31m%s\x1b[0m", data);

module.exports = {
    logCyan,
    logYellow,
    logGreen,
    logRed
}