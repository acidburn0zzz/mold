let slug = require('slug');
let moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 , primaryKey: true },
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    pretty_date: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(date) {
        this.setDataValue('pretty_date', moment(date).format('LL'));
      }
    },
    content: DataTypes.TEXT,
    rendered: DataTypes.TEXT,
    excerpt: DataTypes.TEXT,
    draft: DataTypes.BOOLEAN,
    slug: DataTypes.STRING,
    views: DataTypes.BIGINT,
    header_image: DataTypes.STRING,
  }, {
    classMethods: {
      slugify: function(title) {
        return slug(slug, { lower: true });
      },
    },
  })
}
