function log(level, message, metadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  console.log(JSON.stringify(entry));
}

function info(message, metadata) {
  log("info", message, metadata);
}

function error(message, metadata) {
  log("error", message, metadata);
}

module.exports = {
  info,
  error
};
