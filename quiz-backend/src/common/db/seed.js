import prisma from "./prisma.js";

async function main() {

  await prisma.user.createMany({
    data: [

      // ===== ADMIN =====
      {
        name: "Super Admin",
        email: "admin@quizzer.com",
        password: "admin123",
        role: "ADMIN"
      },

      // ===== TEACHERS =====
      {
        name: "Shikhar Sir",
        email: "teacher1@quizzer.com",
        password: "teacher123",
        role: "TEACHER"
      },

      {
        name: "Akshay Sir",
        email: "teacher2@quizzer.com",
        password: "teacher123",
        role: "TEACHER"
      },

      {
        name: "Yash Sir",
        email: "teacher3@quizzer.com",
        password: "teacher123",
        role: "TEACHER"
      },

      {
        name: "Rohit Sir",
        email: "teacher4@quizzer.com",
        password: "teacher123",
        role: "TEACHER"
      },

      {
        name: "Ankit Sir",
        email: "teacher5@quizzer.com",
        password: "teacher123",
        role: "TEACHER"
      },

      // ===== STUDENTS =====

      {
        name: "Student 1",
        email: "student1@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 2",
        email: "student2@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 3",
        email: "student3@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 4",
        email: "student4@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 5",
        email: "student5@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 6",
        email: "student6@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 7",
        email: "student7@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 8",
        email: "student8@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 9",
        email: "student9@gmail.com",
        password: "student123",
        role: "USER"
      },

      {
        name: "Student 10",
        email: "student10@gmail.com",
        password: "student123",
        role: "USER"
      }

    ],

    skipDuplicates: true
  });

  console.log("Dummy users inserted");

}

main().
then(async()=>{
    await prisma.$disconnect();
})
.catch(async(err)=>{
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
});


