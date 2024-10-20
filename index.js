// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { time } = require("console");
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {


  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");


  // Create a list where we will store the sorted scraped articles
  let sortedArticles = []

  while(sortedArticles.length<100){
    const articles =  await page.locator('.athing')
    const moreButton = page.locator('.morelink')
    const age = await page.locator('.age')
    const articleCount = await articles.count()
    await moreButton.waitFor({state : 'visible'})

    for(let i = 0 ; i < articleCount ; i++){
      // Get an individual Article link text and url
      const article = await articles.nth(i)
      const articleTitle = article.locator('.titleline a').first() //get first link within titline class will throw strict error if dont specify can also use .nth(0)
      const articleLinkText = await articleTitle.textContent()
      const articleURL = await articleTitle.getAttribute('href')
      // Get an individual Article TimeStamp
      const eachAge = age.nth(i)
      const timeStamp = await eachAge.getAttribute('title')
      // Now that we got article title,url, and timestamp append to list as object
      // create article data object
      const articleData = {
        "name" : articleLinkText,
        "link" : articleURL,
        "date" : new Date(timeStamp)  //have to convert the timestamp to new date object to sort
      }

       // Add to the list only if it doesn't already exist
      if (!sortedArticles.some(existingArticle => existingArticle.link === articleData.link)) {
        console.log("New Unique data adding to list")
        sortedArticles.push(articleData);
      }
    }
    console.log(`${sortedArticles.length} has been added to list going next page`)
    // Click the more button if it is visible and wait for articles to load
    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForLoadState('networkidle'); // Wait for the network to be idle
    } else {
      console.log("No more button visible. Stopping.");
      break; // Exit if the more button is not visible
    }
    // Ensure we have exactly 100 or fewer articles
    if (sortedArticles.length > 100) {
      sortedArticles = sortedArticles.slice(0, 100); // Trim to 100 if more were collected
    } 
  }
  // Sorting articles from newest to oldest based on the date
  sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Output sorted articles for verification
  sortedArticles.forEach(article => {
    console.log(`Title: ${article.name}, Date: ${article.date}`);
  });

  await browser.close();

}

(async () => {
  await sortHackerNewsArticles();
})();
