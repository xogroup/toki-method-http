'use strict';

const expect = require('code').expect;   // assertion library
const Promise = require('bluebird');
const Lab = require('lab');
const Hapi = require('hapi');
const Sinon = require('sinon');
const lab = exports.lab = Lab.script();
const { describe, it, before, beforeEach } = lab;

const HttpMethod = require('../src/implementation');
let server;
const actionSpies = {};

describe('HTTP Method', () => {

    before((done) => {

        server = new Hapi.Server();
        server.connection({
            port: 5000
        });

        actionSpies.get = Sinon.spy();
        actionSpies.post = Sinon.spy();

        server.route({
            method: 'GET',
            path: '/test',
            handler: (req, reply) => {

                reply(200);
                return actionSpies.get(req.body, req.headers);
            }
        });

        server.route({
            method: 'POST',
            path: '/test',
            handler: (req, reply) => {

                reply(201);
                return actionSpies.post(req.body, req.headers);
            }
        });

        return server.start(done);
    });

    beforeEach( (done) => {

        actionSpies.get.reset();
        actionSpies.post.reset();

        return done();
    });

    it('should throw an error if no url is provided', { plan: 1 }, () => {

        return Promise
        .resolve()
        .bind({
            action: {}
        })
        .then(HttpMethod)
        .catch( (e) => {

            expect(e).to.be.instanceof(Error);
        });
    });

    it('makes a get request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                url: 'http://localhost:5000/test'
            }
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.get.calledOnce).to.be.true();
        });
    });

    it('makes a post request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                url: 'http://localhost:5000/test',
                method: 'post'
            }
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
        });
    });

    it('makes a post request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                url: 'http://localhost:5000/test',
                method: 'post'
            }
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
        });
    });

    it('makes a post request', () => {

        const testHeader = { 'x-arbitrary': 'Foobar' };
        return Promise
        .resolve()
        .bind({
            action: {
                url: 'http://localhost:5000/test',
                method: 'post',
                headers: testHeader
            }
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
            const spyArgs = actionSpies.post.getCall(0).args;
            expect(spyArgs[1]).to.include(testHeader);
        });
    });
});
