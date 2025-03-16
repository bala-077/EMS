const dashboardRouter = require('express').Router()
const Project = require('../models/book')
const User = require('../models/user')
const Reserve = require('../models/reserve')
const Borrow = require('../models/borrow')
const moment = require('moment')

//GET all data for admin
dashboardRouter.get('/', async (req, res) => {
  const user = req.user
  const userType = req.user.userType

  let dashboardData = ''

  if (userType === 'admin') {
    //BOOKS
    const books = await Project.find({}).sort({ dateCreated: -1 })
    const recentAddedBooks = books.slice(0, 5)
    const totalBooks = books.length

    //STUDENTS
    const students = await User.find({ userType: {$ne:'admin'} }).sort({
      dateCreated: -1,
    })
    const recentAddedStudents = students.slice(0, 5)
    const totalStudents = students.length

    //BORROW
    const borrows = await Borrow.find({ status: 'approved' })
      .sort({ approvedDate: -1 })
      .populate('user', {
        name: 1,
        username: 1,
      })
    const recentBorrows = borrows.slice(0, 5)
    const totalBorrowedBooks = books.filter(
      (book) => book.status === 'borrowed'
    ).length

    //RESERVE
    const reservations = await Reserve.find({})
      .sort({ dateCreated: -1 })
      .populate('user', {
        name: 1,
        username: 1,
      })
    const recentReservations = reservations.slice(0, 5)
    const totalReservedBooks = reservations.filter(
      (reservation) => reservation.status === 'reserved'
    ).length
    const totalPendingReservations = reservations.filter(
      (reservation) => reservation.status === 'pending'
    ).length

    dashboardData = {
      counts: {
        totalBooks,
        totalStudents,
        totalBorrowedBooks,
        totalReservedBooks,
        totalPendingReservations,
      },
      recentBooks: recentAddedBooks,
      recentStudents: recentAddedStudents,
      recentBorrows: recentBorrows,
      recentReservations: recentReservations,
    }
  } else if (userType === 'PM') {
    console.log(userType)
    const today = new Date()
    const books = await Project.find({}).sort({ dateCreated: -1 })
    const PMrecentAddedBooks = books.slice(0, 5)
    const PMtotalBooks = books.length
    

   //STUDENTS
   const students = await User.find({ userType: { $nin: ['admin', 'PM'] } }).sort({dateCreated: -1,})
  const PMrecentAddedStudents = students.slice(0, 5)
  const PMtotalStudents = students.length


    dashboardData = {
      counts: {
        PMtotalBooks,
        PMtotalStudents,
      },
      PMrecentAddedBooks,
      PMrecentAddedStudents,
    }
  }
  else if (userType === 'PL') {
    console.log(userType)
    const today = new Date()
    const books = await Project.find({}).sort({ dateCreated: -1 })
    const PMrecentAddedBooks = books.slice(0, 5)
    const PMtotalBooks = books.length
    

   //STUDENTS
   const students = await User.find({ userType: { $nin: ['admin', 'PM','PL'] } }).sort({dateCreated: -1,})
  const PMrecentAddedStudents = students.slice(0, 5)
  const PMtotalStudents = students.length


    dashboardData = {
      counts: {
        PMtotalBooks,
        PMtotalStudents,
      },
      PMrecentAddedBooks,
      PMrecentAddedStudents,
    }
  }
 

  else if (userType === 'PD') {
    console.log(userType)
    const today = new Date()
    const books = await Project.find({}).sort({ dateCreated: -1 })
    const PMrecentAddedBooks = books.slice(0, 5)
    const PMtotalBooks = books.length
    

   //STUDENTS
   const students = await User.find({ userType: { $nin: ['admin', 'PM','PL'] } }).sort({dateCreated: -1,})
  const PMrecentAddedStudents = students.slice(0, 5)
  const PMtotalStudents = students.length


    dashboardData = {
      counts: {
        PMtotalBooks,
        PMtotalStudents,
      },
      PMrecentAddedBooks,
      PMrecentAddedStudents,
    }
  }
  return dashboardData ? res.json(dashboardData) : res.status(400).end()
})

module.exports = dashboardRouter
