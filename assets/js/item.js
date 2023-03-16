const qs = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
""
function getMetaInfoString(field, word) {
    return field ? field.replace(/\n/g, "<br>") : `<i>No ${word} provided.</i>`;
}

$.get("/BobikArchive/assets/master_database.json", (data) => {
    const MASTER_DB = data;
    let item_meta;

    if (MASTER_DB.works[qs.id]) {
        item_meta = MASTER_DB.works[qs.id];
    } else {
        window.location.replace("/BobikArchive/404");
    }

    // display name, description & notes
    document.getElementById("item-name").innerHTML = item_meta.displayName;
    document.getElementById("item-description").innerHTML = getMetaInfoString(item_meta.description, "description");
    document.getElementById("item-notes").innerHTML = getMetaInfoString(item_meta.notes, "notes");
    
    // images
    if (item_meta.images || item_meta.images > 0) {
        let images = document.getElementById("item-images");
        item_meta.images.forEach((url) => {
            let child = document.createElement("img");
            child.src = `assets/db_files/${qs.id}/${url}`
            child.style.width = "300px";
            child.style.margin = "2px";
            images.appendChild(child)
        });
    } else {
        document.getElementById("item-images").innerHTML = '<i>No images provided.</i>';
    }

    // information
    const INFO_TABLE = document.getElementById("item-info");
    const INFO_ITEMS = ["medium", "originalDate", "archiveDate", "originalSource"];
    const INFO_ITEMS_D = {
        medium: "Medium",
        originalDate: "Original Date",
        archiveDate: "Archival Date",
        originalSource: "Original Source"
    }
    INFO_ITEMS.forEach(key => {
        if (!item_meta[key]) {
            return;
        }
        let row = INFO_TABLE.insertRow();
        let contents = item_meta[key]

        if (/^(original|archive)Date$/.exec(key)) {
            let date = new Date(contents)
            contents = `<span title="${date.toDateString()}" class="hastooltip">${contents}</span>`
        } else if (key == "originalSource") {
            contents = `<a href="${contents}" title="${contents}">link</a>`
        }

        $(row).append(`<th>${INFO_ITEMS_D[key]}</th>`)
        $(row).append(`<td>${contents}</td>`)
    });

    // downloads
    const DOWNLOADS_TABLE = document.getElementById("item-downloads");


    item_meta.downloadLinks.forEach(linkData => {
        let row = DOWNLOADS_TABLE.insertRow();
        $(row).append(`<th>${linkData.name}</th>`)
        
        let notes = ""
        if (linkData.notes && linkData.notes.trim() != "") {
            notes = ` (<span title="${linkData.notes}" class="hastooltip">notes</span>)`
        }
        $(row).append(`<td><a href="${linkData.link}" title="${linkData.link}">link</a>${notes}</td>`)
    });
});