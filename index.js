const NewsAPI = require('newsapi')
const $ = require('jquery')
const newsapi = new NewsAPI('70f32a9ffac04ec08ea49ba6e5b00fb7')
let navItems = $('.nav-group-item') //helps us find the group of navigation items
let articles = null

getNews('business') // this is the default category as the app launches


// this function is structured around a promise
// when newsapi.v2.topHeadlines runs it returns the 'results' to 'then' function
// Errors are handled with the catch function
function getNews(category){
    newsapi.v2.topHeadlines({
        category: category,
        language: 'en',
        country: 'us'
    }).then((results) => {
        console.log(results.articles)
        articles = results.articles
        showNews(results.articles)
    }).catch((err) => {
        console.log(err)
    })
}

function showNews(allNews){
    $('#news-list').html('') // clear the news list before displaying any new news items, we use the ID of the news-list
    $('#news-list').append(`
    <li class="list-group-header">
        <input class="form-control" type="text" value="" placeholder="Search for news" onchange="search(this)">
    </li>
    
    `) // we must add back in the search bar which we deleted when we cleared the html
    allNews.forEach(news =>{
        // we use string templates ${news.title} to access the properties of the object
        let singleNews = `
        <li class="list-group-item">
            <img class="img-circle media-object pull-left" src="${news.urlToImage}" width="50" height="50"> 
            <div class="media-body">
                <strong><a href="${news.url}" onclick="openArticle(event)">${news.title}</a></strong>
                <div>
                    <span class="">${news.publishedAt}</span>
                    <span class="pull-right">Author: ${news.author}</span>
                </div>
                <p>${news.description}</p>
            </div>
        </li>
        `
        $('#news-list').append(singleNews)

    })
}

function openArticle(event){
    event.preventDefault() //stop the article from immediately loading
    let link = event.target.href //extract the url from the event
    window.open(link) //open the link in a new renderer instance
}

// if any of our Navigation items are clicked
navItems.click((event)=>{
    let category = event.target.id // find out which one was clicked
    navItems.removeClass('active') // remove the active indication from the Nav items list
    $(event.target).addClass('active') // make the current one active
    getNews(category) // pass the categoty to the get news function
})

// accepts the input field data
function search(input){
    let query = $(input).val() //get the users search string using jquery
    //list have a filter function, we can create one that searches the title for a given query by using the str.includes function
    let sortedArticles = articles.filter((item)=>item.title.toLowerCase().includes(query.toLowerCase())) //The filter() method creates an array filled with all array elements that pass a test (provided as a function).
    showNews(sortedArticles)
}