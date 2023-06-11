// const puppeteer = require("puppeteer");
// let browserOpenPromise = puppeteer.launch({
//     headless:false,
//     defaultViewport:null,
//     args:["--start-maximized"]
// });
// browserOpenPromise
//     .then(function(){
//         console.log("browser is opened");
//     });
// ).catch(function(err){
//     console.log("getting error: "+err);
// })
let {answer} = require("./code");
let currentTabPromises;
let email = "mariaireslira@emvil.com";
let passWord = "Babloo@123";
const puppeteer = require("puppeteer");
let browserOpenPromise = puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"],
    
})
browserOpenPromise
.then(function(browser){
    console.log("browser is open");
    // an array of all open pages inside the browser
    let allTabsOpenPromises = browser.pages();
    return allTabsOpenPromises;
})
.then(function(allTabsArr){
    currentTabPromises = allTabsArr[0];
    console.log("Open the new tab");
    // URL to navigato page to
    // goto function url leta hai or page open karta hai
    let visitingLoginPagePromises = currentTabPromises.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromises;
})
.then(function(){
    console.log("opened hackerRank login pages");
    let emailWillBeTypedPromises = currentTabPromises.type(`input[name="username"]`, email);
    return emailWillBeTypedPromises;
})
.then(function(){
    console.log("email will be typed on login page");
    let passWordWillBeTypedPromises = currentTabPromises.type(`input[name="password"]`, passWord);
    return passWordWillBeTypedPromises;
})
.then(function(){
    console.log("password will be typed");
    let clickCheckBox = currentTabPromises.click(`input[type="checkbox"]`);
    return clickCheckBox;
})
.then(function(){
    console.log("marked remembered me");
    let link = ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled";
    let willBeLoggedInPromises = currentTabPromises.click(link);
    return willBeLoggedInPromises;
})
.then(function(){
    console.log("hacker rank is opened");
    // create a promise for wait and select the algorithm node
    let clickOnAlgoBtnPromises = waitAndSelect("div[data-automation='algorithms']");
    return clickOnAlgoBtnPromises;
})
.then(function(){
    console.log("algoBtn is clicked and open the algorithm page");
    let allQuesPromis = currentTabPromises.waitForSelector(`a[data-analytics="ChallengeListChallengeName"]`);
    return allQuesPromis;
})
.then(function(){
    function getAllQuesLinks(){
        let allEle = document.querySelectorAll(`a[data-analytics="ChallengeListChallengeName"]`);
        let linksArr = [];
        for(let i = 0; i < allEle.length; i++){
            linksArr.push(allEle[i].getAttribute("href"));
        }
        return linksArr;
    }
    let linksArrPromis = currentTabPromises.evaluate(getAllQuesLinks);
    return linksArrPromis;
})
.then(function(linksArr){
    console.log("links to all questions received");
    let questionSolvePromis = questionSolver(linksArr[0],0);
    for(let i = 0; i < linksArr.length; i++){
        questionSolvePromis = questionSolvePromis.then(function(){
            return questionSolver(linksArr[i], i);
        })
    }
    return questionSolvePromis;
})
.then(function(){
    console.log("first question is solve");
})

.catch(function(err){
    console.log("getting error: ", err);
})

function waitAndSelect(algoBtn){
    let myPromis = new Promise(function(resolve, reject){
        let waitAndSelectPromis = currentTabPromises.waitForSelector(algoBtn);
        waitAndSelectPromis
        .then(function(){
            let clickOnAlgoBtnPromis = currentTabPromises.click(algoBtn);
            return clickOnAlgoBtnPromis;
        })
        .then(function(){
            resolve();
        })
        .catch(function(err){
            reject(err);
        })
    })
    return myPromis;
}

function questionSolver(url, idx){
    return new Promise((resolve, reject) => {
    let fullLink = `https://www.hackerrank.com${url}`;
    let gotoQuesPagePromis = currentTabPromises.goto(fullLink);
    gotoQuesPagePromis
    .then(function(){
        console.log(`${idx}th question page opened`);
        // select the custom input
        let waitForCheckBoxAndClickPromis = waitAndSelect(".checkbox-input");
        return waitForCheckBoxAndClickPromis;
    })
    .then(function(){
        // select the text box to type
        let waitForTextBoxPromis = currentTabPromises.waitForSelector(".custominput");
        return waitForTextBoxPromis;
    })
    .then(function(){
        let codeWillBeTypePromis = currentTabPromises.type(".custominput", answer[idx]);
        return codeWillBeTypePromis;
    })
    .then(function(){
        let controlKeyPressPromis = currentTabPromises.keyboard.down("Control");
        return controlKeyPressPromis;
    })
    .then(function(){
        let aKeyPressPromis = currentTabPromises.keyboard.press("a");
        return aKeyPressPromis;
    })
    .then(function(){
        let xKeyPressPromis = currentTabPromises.keyboard.press("x");
        return xKeyPressPromis;
    })
    .then(function(){
        let controlKeyupPromis = currentTabPromises.keyboard.up("Control");
        return controlKeyupPromis;
    })
    .then(function(){
        let cursorOnEditorPromis = currentTabPromises.click(".monaco-editor.no-user-select.vs");
        return cursorOnEditorPromis;
    })
    .then(function(){
        let controlKeyDownPromis = currentTabPromises.keyboard.down("Control");
        return controlKeyDownPromis;
    })
    .then(function(){
        let aKeyPressPromis = currentTabPromises.keyboard.press("a");
        return aKeyPressPromis;
    })
    .then(function(){
        let vKeyPressPromis = currentTabPromises.keyboard.press("v");
        return vKeyPressPromis;
    })
    .then(function(){
        let controlKeyupPromis = currentTabPromises.keyboard.up("Control");
        return controlKeyupPromis;
    })
    .then(function(){
        let submitKeyPressPromis = currentTabPromises.click(".hr-monaco-submit");
        return submitKeyPressPromis;
    })
    .then(function(){
        console.log("written the code for this question and submitted");
        resolve();
    })
    .catch(function(err){
        reject(err);
    });

    })
}