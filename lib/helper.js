const path = require('path');

exports.getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

exports.getToolPath = (dir = './') => {
  return path.join(__dirname, dir);
};
