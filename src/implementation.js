'use strict';

const Templater = require('toki-templater');
const Request = require('superagent');
const Joi = require('joi');
const Promise = require('bluebird');

const configSchema = Joi.object().keys({
    url: Joi.string().uri().required(),
    passThroughHeaders: Joi.alternatives().try(Joi.boolean(), Joi.array()),
    headers: Joi.object(),
    payload: Joi.any(),
    method: Joi.string().allow(['get', 'post', 'put', 'del', 'patch']).default('get'),
    type: Joi.string().allow(['json', 'application/json'])
});

module.exports = function () {

    return Promise
    .resolve()
    .bind(this)
    .then( () => Templater(this.action, configSchema) )
    .then((config) => {

        this.config = config;
    })
    .then(() => {
        //url
        const req = Request(this.config.method, this.config.url);

        //content type
        if (this.config.type) {
            req.type(this.config.type);
        }

        //body
        if (this.config.payload) {
            req.send(this.config.payload);
        }

        //proxy along  headers
        if (this.config.passThroughHeaders) {
            if (this.config.passThroughHeaders === true) {
                req.set(this.request.headers);
            }
            else {
                this.config.passThroughHeaders.forEach( (header) => {

                    req.set(header, this.request.headers[header]);
                });
            }
        }

        //fixed headers which override pass through
        if (this.config.headers) {
            req.set(this.config.headers);
        }

        return req;
    });

};
