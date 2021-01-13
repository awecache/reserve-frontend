module.exports = [
  {
    context: ["/api", "/auth/login"],
    target: "http://localhost:3000/",
    secure: false,
    logLevel: "debug",
  },
];
