const express = require("express");
const request = require('request');
const cheerio = require('cheerio');
const { children, eq } = require("cheerio/lib/api/traversing");


const app = express();

app.get('/:siteName/:userName', (req, res) => {

  let site_name = req.params.siteName;
  let user_name = req.params.userName;

  if (site_name == "codeforces") {

    /////////////////////////// Web Scrapping Codeforces //////////////////////////

    let url = `https://codeforces.com/profile/${user_name}`;

    request(url, (err, response, html) => {

      if (!err && response.statusCode == 200) {

        const $ = cheerio.load(html);

        let userDetails = {};

        //--- User Rank ---
        let user_rank = $('.user-rank span').text();
        if (user_rank != undefined) {
          userDetails.user_rank = user_rank;
        } else {
          userDetails.user_rank = "Not present";
        }

        // --- User username ---
        let username = $('.main-info').children().eq(1).text();
        if (username != undefined) {
          userDetails.username = $('.main-info').children().eq(1).text().trim();
        } else {
          username = "Not present";
        }

        // --- User name ---
        let name = $('.main-info').children().eq(2).children().eq(0).text().split(',')[0];
        if (name != undefined) {
          userDetails.name = $('.main-info').children().eq(2).children().eq(0).text().split(',')[0].trim();
        } else {
          userDetails.name = "Not present";
        }


        // --- User City name ---
        let city = $('.main-info').children().eq(2).children().eq(0).text().split(',')[1];
        if (city != undefined) {
          userDetails.city = $('.main-info').children().eq(2).children().eq(0).text().split(',')[1].trim();
        } else {
          userDetails.city = "Not present";
        }

        // --- User Country ---
        let country = $('.main-info').children().eq(2).children().eq(0).text().split(',')[2];
        if (country != undefined) {
          userDetails.country = $('.main-info').children().eq(2).children().eq(0).text().split(',')[2].trim();
        } else {
          userDetails.country = "Not present";
        }


        // --- User Organization ---
        let organization = $('.main-info').children().eq(2).children().eq(1).text();
        if (organization != undefined) {
          userDetails.organization = $('.main-info').children().eq(2).children().eq(1).text().trim();
        } else {
          userDetails.organization = "Not present";
        }


        // --- User Contest Rating ---
        let contest_rating = $('.info').children('ul').children().eq(0).text().split(':')[1];
        if (contest_rating != undefined) {
          userDetails.contest_rating = $('.info').children('ul').children().eq(0).text().split(':')[1].trim();
        } else {
          userDetails.contest_rating = "Not present";
        }


        // --- User Contribution ---
        let contribution = $('.info').children('ul').children().eq(1).text().split(':')[1];
        if (contribution != undefined) {
          userDetails.contribution = $('.info').children('ul').children().eq(1).text().split(':')[1].trim();
        } else {
          userDetails.contribution = "Not present";
        }


        // --- User friend of ---
        let friend_of = $('.info').children('ul').children().eq(2).text().split(':')[1];
        if (friend_of != undefined) {
          userDetails.friend_of = $('.info').children('ul').children().eq(2).text().split(':')[1].trim();
        } else {
          userDetails.friend_of = "Not present";
        }


        // --- User Last Visited ---
        let last_visited = $('.info').children('ul').children().eq(3).text().split(':')[1];
        if (last_visited != undefined) {
          userDetails.last_visited = $('.info').children('ul').children().eq(3).text().split(':')[1].trim();
        } else {
          userDetails.last_visited = "Not present";
        }


        // --- User Registered ---
        let registered = $('.info').children('ul').children().eq(4).text().split(':')[1];
        if (registered != undefined) {
          userDetails.registered = $('.info').children('ul').children().eq(4).text().split(':')[1].trim();
        } else {
          userDetails.registered = "Not present";
        }

        res.send(userDetails);
      }
    });

  } else if (site_name == "codechef") {


/////////////////////////// Web Scrapping Codechef //////////////////////////

    url = `https://www.codechef.com/users/${user_name}`

    request(url, (err, response, html) => {

      if (!err && response.statusCode == 200) {
        const $ = cheerio.load(html);

        let userDetails = {};

        // User Status Code
        userDetails.status = response.statusCode

        // Username Done
        let name = $('.h2-style').text();
        if(name!= undefined){
          userDetails.name = $('.h2-style').text().trim();
        } else {
          userDetails.name = "Not Present";
        }


        let internal_details_array = [];
        
        $('.side-nav').children('li').each(function (i, e) {

          let internal_details_object = {};
        
          let first_field = $(this).text().split(':')[0].trim();
          let second_field = $(this).text().split(':')[1].trim();
          
          internal_details_object.first_field = first_field;
          internal_details_object.second_field = second_field; 

          internal_details_array[i] = internal_details_object; 
        });

        userDetails.profile = internal_details_array;



        //  Global Rank Done
        userDetails.global_rank = $('.rating-ranks .inline-list').children().children().first().text();

        //  Country Rank Done
        userDetails.country_rank = $('.rating-ranks .inline-list').children().children().last().text();

        // Defining Practice Problems Array
        let fullySolvedPracticeProblems = [];
        let partiallySolvedPracticeProblems = [];


        //  Fully Solved Practice Problems Done
        let fully_Solved_Practice_Problems = $('.problems-solved > .content').children().eq(1).children().eq(0).children('span').children();

        if(fully_Solved_Practice_Problems!= undefined)
        {
          fully_Solved_Practice_Problems.each((i, e) => {

            eachFullySolvedObject = {};
  
            eachFullySolvedObject.problemName = $(e).text();
  
            eachFullySolvedObject.problemLink = 'https://www.codechef.com' + $(e).attr('href');
  
            fullySolvedPracticeProblems[i] = eachFullySolvedObject
          });

          userDetails.fullySolvedPracticeProblems = fullySolvedPracticeProblems;
  
        } else {
          userDetails.fullySolvedPracticeProblems = "Not done any practice problems yet !!";
        }

       
        //  Partially Solved Practice Problems Done
        let partially_Solved_Practice_Problems = $('.problems-solved > .content').children().eq(3).children().eq(0).children('span').children()

        if(partially_Solved_Practice_Problems!= undefined){

          partially_Solved_Practice_Problems.each((i, e) => {

            eachPartiallySolvedObject = {}
  
            eachPartiallySolvedObject.problemName = $(e).text();
  
            eachPartiallySolvedObject.problemLink = 'https://www.codechef.com' + $(e).attr('href');
  
            partiallySolvedPracticeProblems[i] = eachPartiallySolvedObject
  
          });
          
          userDetails.partiallySolvedPracticeProblems = partiallySolvedPracticeProblems;

        } else {

          userDetails.partiallySolvedPracticeProblems = "Not done any practice problems yet !!"

        }

        // console.log(userDetails);
        res.json(userDetails);
      }
    });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server started on port 3000");
});