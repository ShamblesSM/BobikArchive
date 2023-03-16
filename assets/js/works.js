const qs = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

$.get("/BobikArchive/assets/master_database.json", (data) => {
    const MASTER_DB = data;

    const VALID_QS = ["spherematchers", "pekkakana2"]
    const MEDIUM_KEYS = {
        spherematchers: "Sphere Matchers",
        pekkakana2: "Pekka Kana 2"
    }

    if (!VALID_QS.includes(qs.category)) {
        window.location.replace("/404");
    }

    document.getElementById("works-header").innerHTML = `${MEDIUM_KEYS[qs.category]} Works`;

    // loop through the database and filter only works of that kind
    const FILTERED_DATA = {}

    for (const work in MASTER_DB.works) {
        if (MASTER_DB.works[work].category == qs.category) {
            FILTERED_DATA[work] = MASTER_DB.works[work]
        }
    }

    const WORKS_TABLE = document.getElementById("works-table");

    for (const workId in FILTERED_DATA) {
        let row = WORKS_TABLE.insertRow();
        let work = FILTERED_DATA[workId];

        // display name
        $(row).append(`<td><a href="/BobikArchive/item?id=${workId}">${work.displayName}</a></th>`);

        // archive date
        let arcdate = new Date(work.archiveDate);
        $(row).append(`<td><span title="${arcdate.toDateString()}" class="hastooltip">${work.archiveDate}</span></th>`);

        // og date
        let origdate = new Date(work.originalDate);
        $(row).append(`<td><span title="${origdate.toDateString()}" class="hastooltip">${work.originalDate}</span></th>`);
    }
});