// @ts-check
///<reference path="../global.d.ts" />

import * as jwt from "jsonwebtoken";

Cypress.Commands.add("loginByAuth0Api", (username: string, password: string) => {
  cy.log(`Logging in as ${username}`);
  const client_id = Cypress.env("auth0_client_id");
  const client_secret = Cypress.env("auth0_client_secret");
  const audience = Cypress.env("auth0_audience");
  const scope = Cypress.env("auth0_scope");

  cy.request({
    method: "POST",
    url: `https://${Cypress.env("auth0_domain")}/oauth/token`,
    body: {
      grant_type: "password",
      username,
      password,
      audience,
      scope,
      client_id,
      client_secret,
    },
  }).then(({ body }) => {
    const user: any = jwt.decode(body.id_token);

    const userItem = {
      token: body.access_token,
      user: {
        sub: user.sub,
        nickname: user.nickname,
        picture: user.name,
        email: user.email,
      },
    };

    window.localStorage.setItem(Cypress.env("auth_token_name"), JSON.stringify(userItem));
  });

  cy.visit("/");
});
