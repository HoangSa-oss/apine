module.exports = {
  apps : [
  {
    name   : "api",
    script : "npm",
    args:"start"
  },
  {
    name   : "crawler",
    script : "npm",
    args:"run crawler",
    instances : "2",
    exec_mode : "cluster"
  },
  {
    name   : "addQueue",
    script : "npm",
    args:"run add",
    cron_restart: "*/30 * * * * *"

  }
]
}