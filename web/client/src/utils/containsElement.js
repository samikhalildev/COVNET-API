const containsElement = (array, value, obj=false) => {
    return !obj ? array.map(item => item.toString()).indexOf(value.toString()) : array.map(item => item[obj].toString()).indexOf(value.toString())
}

export default containsElement;