const collectionsQuery = `query {
    
    collections(first: 30) {
        nodes {
            id
            handle
            title
            description
        }
    }
    
    
}`;

const menuQuery = `query MyQuery {
    menu(handle: "menu") {
        items {
            title
            items {
                id
                title
                tags
                url
                type    
            }
        }
    }
}

`;

export default menuQuery;
