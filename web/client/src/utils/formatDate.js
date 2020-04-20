const formatDate = timestamp => {
    let time = new Date(timestamp).toLocaleTimeString();
    time = time.substring(0, time.split(':')[0].length === 2 ? 5 : 4) + ' ' + time.split(' ')[1]

    return `at ${time} on ${new Date(timestamp).toDateString()}`;
}

export default formatDate