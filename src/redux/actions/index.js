let nextArtId = 0
export const addNew = text => ({
    type:'addNew',
    id: nextArtId++,
    text
});
