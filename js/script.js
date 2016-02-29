console.log($)

// var apiKey = '?access_token=4ec879e96a1415c2f5efcea69f2b7664edb30f93'
var baseURL = 'https://api.github.com/users/'
var userProfile = 'boazblake'
var userRepo = userProfile + '/repos' 
var inputEl = document.querySelector("input")

function makeAndReturnPromise(inputURL, paramsObj) {
    var formattedParams = ''
    if( paramsObj ) {formattedParams = _formatURLParams(paramsObj) }

    return $.getJSON(inputURL + formattedParams )
}

var _formatURLparams = function(paramsObj) {
   var paramString = ''
   for (var aKey in paramsObj) {
       var val = paramsObj[aKey]
       paramString += "&" + aKey + "=" + paramsObj[aKey]
   }
   return paramString.substr(1)
}

function _gitUserURL(userName) {

    return baseURL + userName //+ apiKey
    //=> https://api.github.com/users/blakeboaz?access_token=4ec879e96a1415c2f5efcea69f2b7664edb30f93
}

function _gitUserRepoURL(userName){

    return baseURL + userName + '/repos'// + apiKey
    //=> https://api.github.com/users/blakeboaz/repos?access_token=4ec879e96a1415c2f5efcea69f2b7664edb30f93
}

var controller = function() {
	var hash = location.hash.substr(1)
}

//Profile Data Function

var handleDataProfile = function(jsonProfileData) {
    // console.log(jsonProfileData)
    var domPRofileString = ''
    var profileObject = jsonProfileData
    domPRofileString += profileToHTML(profileObject)
    var profileContainer = document.querySelector('.left')
    profileContainer.innerHTML = domPRofileString
}

//Profile Data to DOM

var profileToHTML = function(profileObject) {
    // console.log(profileObject)
    var avatarImgSrc = profileObject.avatar_url
    var name = profileObject.name
    var email = profileObject.email
    var blog = profileObject.blog
    var hire = profileObject.hireable
    var bio = profileObject.bio
    var location = profileObject.location
    if (bio === null) bio = ''
    if (hire === true) hire = 'available for employment'

    var newProfileToDom = '<img class="profilePic" src="' + avatarImgSrc + '">'
    newProfileToDom += '<ul class="profileListContainer"><li class="profileName"><h3>' + name + '</h3></li>'
    newProfileToDom += '<li class="profileEmail"><i class="fa fa-envelope"></i>' + email + '</li>'
    newProfileToDom += '<li class="profilelocation"><i class="fa fa-globe"></i>' + location + '</li></ul><br><br>'
    newProfileToDom += '<div class="profileBlog box"><i class="fa fa-pencil-square-o"></i><p class="text">Blog</p></div>'
    newProfileToDom += '<div class="profileBio box">' + bio + '<p class="text">Bio</p></div>'
    newProfileToDom += '<div class="profileHireable box"><i class="fa fa-code-fork"></i><p class="text">'+ hire +'</p></div>'

    return newProfileToDom
}

// Repos Data Function & sending to DOM

var handleDataRepos = function(jasonDataRepo) {
    // console.log([jasonDataRepo])
    var domRepoString = ''
    for (var i = 0; i < jasonDataRepo.length; i++) {
        domRepoString += '<a href="'+jasonDataRepo[i].html_url+'"target="_blank"><div class="repoList"> <h4>Repo Name:     ' + jasonDataRepo[i].name + '</h2><br>Number Of Open Issues:     ' + jasonDataRepo[i].open_issues_count + '</div></a>'
    }
    var repoContainer = document.querySelector('.right')
    repoContainer.innerHTML = domRepoString
        // console.log()

}

var newSearch = function(keyEvent) {
    var inputEl = keyEvent.target

    if (keyEvent.keyCode === 13) {
        var userLookupVal = inputEl.value
        inputEl.value = ''
        window.location.hash = userLookupVal

	}
}

inputEl.addEventListener('keydown', newSearch)

var handleHashChange = function (evt) {
     // console.log(window.location.hash)
    var userLookupVal = (window.location.hash).substr(1)

    var userGH_URL = _gitUserURL(userLookupVal)
    var userGhRepoURL = _gitUserRepoURL(userLookupVal)

    makeAndReturnPromise(userGH_URL).then(handleDataProfile)
    makeAndReturnPromise(userGhRepoURL).then(handleDataRepos)

}

// webApp initialization (first thing that happens on loading page)
console.log(window.location.hash)
if (window.location.hash) {
    handleHashChange()
} else {
    var userURL = _gitUserURL('boazblake')
    var repoURL = _gitUserRepoURL('boazblake')
    makeAndReturnPromise( userURL ).then(handleDataProfile)
    makeAndReturnPromise( repoURL ).then(handleDataRepos)
}

window.addEventListener('hashchange', handleHashChange)