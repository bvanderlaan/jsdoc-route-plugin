/**
 * This module defines a custom jsDoc tag.
 * It allows you to document route parameters of a route.
 * @module lib/routeparam
 */

'use strict';

const tableBuilder = require('./parameterTableBuilder');

exports.name = 'routeparam';
exports.options = {
  mustHaveValue: true,
  mustNotHaveDescription: false,
  canHaveType: true,
  canHaveName: true,
  onTagged: function(doclet, tag) {
    if (!doclet.routeparams) {
      doclet.routeparams = [];
    }

    doclet.routeparams.push({
      'name': tag.value.name,
      'type': tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : '',
      'description': tag.value.description || '',
    });
  },
}
exports.newDocletHandler = function(e) {
  const parameters = e.doclet.routeparams;
  if (parameters) {
    const table = tableBuilder.build('Route Parameters', parameters);

    e.doclet.description = `${e.doclet.description}
                            ${table}`;
  }
}
