"use strict"

const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

module.exports = {
  getSkillsById,
  getUserDetails,
  getSkills,
  getTop3,
  addShowcaseVideo,
  uploadShowcase,
  statusUpdate,
  upVote,
  downVote
}

function getSkills () {
  return knex ('skills')
    .then(data => {
      return data
    })
}

function getTop3 () {
  return knex ('skills')
    .join('videos', 'skill_id', '=', 'skills.id')
    .then(data => {
      return sort(data)
    })
}

function uploadShowcase (user_id, id, url) {
  return knex ('userSkills')
    .where('user_id', user_id)
    .insert({
      user_id: user_id,
      skill_id: id,
      showcaseURL: url,
      status: "attempted"
    })
}

function addShowcaseVideo (id, url) {
  return knex ('videos')
    .insert({
      skill_id: id,
      url: url,
      type: 'showcase',
      votes: 0
    })
}

function sort (data) {
  data.sort(function(a, b) {
    if (a.votes > b.votes) {
      return -1
    }
    if (a.votes < b.votes) {
      return 1
    }
    return 0
  })

  let top3 = data.map(key => {
    return ({
      skillName: key.skillName,
      url: key.url,
      votes: key.votes
    })
  })

  return top3.slice(0, 3)
}

function getSkillsById (id) {
  return knex ('skills')
    .join('videos', 'skill_id', '=', 'skills.id')
    .where('skill_id', id)
    .then(data => {
      return createArray(data)
    })
}

function createArray (data) {
  let videoList = {}
  videoList.videos = []

  data.map(key => {
    videoList.id = key.skill_id
    videoList.skillName = key.skillName
    videoList.category = key.category
    videoList.videos.push({id: key.id, url: key.url, votes: key.votes, type: key.type})
  })
  return videoList
}


function getUserDetails (id) {
  return knex ('userSkills')
    .join('skills', 'skills.id', '=', 'skill_id')
    .join('users', 'users.id', '=', 'user_id')
    .where('user_id', id)
    .then(data => {
      const skillList = data.map(key => {
        return {
          id: key.skill_id,
          skillName: key.skillName,
          category: key.category,
          status: key.status,
          skillXp: getSkillXp(key.status),
          showcase: key.showcaseURL
        }
      })

      return Object.assign({},
        {skillList: skillList},
        {id: data[0].id,
        username: data[0].username,
        profile_pic: data[0].profile_pic,
        level: level(totalXp(skillList)),
        totalXp: totalXp(skillList),
        remainingXp: remainingXp(totalXp(skillList))
      })
    })
}

function getSkillXp (status) {
  switch (status) {
    case 'watched':
      return 25
    case 'attempted':
      return 50
    case 'succeeded':
      return 75
    case 'contributed':
      return 100
  }
}

function level (totalXp) {
  return Math.floor(totalXp/100)
}

function totalXp (skillList) {
  return skillList.reduce((sum, elem) => {
    return sum + elem.skillXp
  }, 0)
}

function remainingXp (totalXp) {
  return 100 - totalXp % 100
}

function statusUpdate (user_id, skill_id, status) {
  return knex ('userSkills')
    .where({
      user_id: user_id,
      skill_id: skill_id
    })
    .update({
      status: status
    })
}

function upVote (id) {
  return knex ('videos')
    .where('id', id)
    .increment('votes', 1)
}

function downVote (id) {
  return knex ('videos')
    .where('id', id)
    .where('votes', '>', 0)
    .decrement('votes', 1)
}
