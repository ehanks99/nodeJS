
let allMovies;
let allDirectors;
let allActors;
let allGenres;
let allRatings;

function openTab(evt, tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

function loadInfo() {
    // Send out AJAX requests to grab all the data we'll need (to help the user
    // along) if the user decides to edit a movie. If we receive any errors
    // from these server calls, we don't really care
    $.get("/project02/allmovies", function(returnedInfo) {
        if (returnedInfo.success == true) {
            allMovies = returnedInfo.results;
        }
    });

    $.get("/project02/alldirectors", function(returnedInfo) {
        if (returnedInfo.success == true) {
            allDirectors = returnedInfo.results;
            
            returnedInfo.results.forEach(function addDataListToInput(item, index) {
                let option = "<option value='" + item.data + "'>";
                document.getElementById("directors0").innerHTML += option;
            });
        }
    });

    $.get("/project02/allactors", function(returnedInfo) {
        if (returnedInfo.success == true) {
            allactors = returnedInfo.results;
            
            returnedInfo.results.forEach(function addDataListToInput(item, index) {
                let option = "<option value='" + item.data + "'>";
                document.getElementById("actors0").innerHTML += option;
            });
        }
    });

    $.get("/project02/allgenres", function(returnedInfo) {
        if (returnedInfo.success == true) {
            allGenres = returnedInfo.results;
            
            returnedInfo.results.forEach(function addDataListToInput(item, index) {
                let option = '<div class="col-sm-2"></div>' +
                             '<div class="form-check form-check-inline">' +
                             '  <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="' + item.data + '">' +
                             '  <label class="form-check-label" for="inlineCheckbox1" name="genre[]">' + item.data + '</label>' +
                             '</div>';
                document.getElementById("genres").innerHTML += option;
            });
        }
    });

    $.get("/project02/allratings", function(returnedInfo) {
        if (returnedInfo.success == true) {
            allRatings = returnedInfo.results;
            
            returnedInfo.results.forEach(function addDataListToInput(item, index) {
                let option = "<option value='" + item.data + "'>" + item.data + "</option>";
                document.getElementById("rated").innerHTML += option;
            });
        }
    });
}


let directorId = 0;
let actorId = 0;

function addElement(parentId, elementTag, elementId, html) 
{
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

function addDirector(parentId)
{
    actorId++;
    let html = '<input list="directors' + directorId + '" name="director" id="director' + directorId + '">' +
               '<datalist id="directors' + directorId + '">' + document.getElementById("directors0").innerHTML + // actors0 is the base dataList to use
               '</datalist>';
    html += '<a href="" onclick="removeElement(\'director' + directorId + '\'); return false;">Remove</a>';

    addElement(parentId, 'p', 'director' + directorId, html);
}

function addActor(parentId)
{
    actorId++;
    let html = '<input list="actors' + actorId + '" name="actor" id="actor' + actorId + '">' +
               '<datalist id="actors' + actorId + '">' + document.getElementById("actors0").innerHTML + // actors0 is the base dataList to use
               '</datalist>';
    html += '<a href="" onclick="removeElement(\'actor' + actorId + '\'); return false;">Remove</a>';

    addElement(parentId, 'p', 'actor' + actorId, html);
}

function removeElement(elementId) 
{
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}