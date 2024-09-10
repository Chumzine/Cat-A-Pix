const CatList = (() => {
    let list = [];

    const getList = () => list;

    const addItemToList = (itemObj) => {
        list.push(itemObj);
    };

    const updateItemInList = (itemObj, index) => {
        list[index] = itemObj;
    };

    const removeItemFromList = (index) => {
        list.splice(index, 1);
    };

    return {
        getList,
        addItemToList,
        updateItemInList,
        removeItemFromList
    };
})();

export default CatList;

