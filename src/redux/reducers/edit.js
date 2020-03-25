const diarys =(state=[],action)=>{
    switch (action.type){
        case 'addNew':
            return[
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
    }
}