'use strict';

const Templater = require('toki-templater');
const Request = require('superagent');
const Joi = require('joi');
const Promise = require('bluebird');

const configSchema = Joi.object().keys({
    name: Joi.string(),
    url: Joi.string().uri().required(),
    passThroughHeaders: Joi.alternatives().try(Joi.boolean(), Joi.array()),
    headers: Joi.object(),
    payload: Joi.any(),
    method: Joi.string().allow(['get', 'post', 'put', 'del', 'patch']).default('get'),
    type: Joi.string().allow(['json', 'application/json']),
    clientResponse: Joi.alternatives().try(Joi.boolean(), Joi.object()),
    output: Joi.any()
});

module.exports = function () {

    return Promise
    .resolve()
    .bind(this)
    .then( () => Templater(this.action, configSchema, { allowUnknown: true } ) )
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
    }).then((response) => {

        this.action.output = response.body;
    })
    .then(() => Templater(this.action, configSchema, { allowUnknown: true } )) //we need to re-call the templater to handle mapping our response body
    .then((updatedConfig) => {

        this.config = updatedConfig;
    })
    .then(() => {

        if (this.config.clientResponse) {
            if (this.config.clientResponse === true) {
                this.response.send(this.action.output);
            }
            else {
                this.response.send(this.config.clientResponse);
            }
        }

        return this.action.output;
    });

};
