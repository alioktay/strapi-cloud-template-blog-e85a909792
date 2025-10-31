'use strict';

/**
 *  global controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // Call the default find method
    const { data, meta } = await super.find(ctx);

    // Get the global entity with populated menu relations
    const entity = await strapi.entityService.findOne('api::global.global', data.id, {
      populate: {
        mainMenu: {
          populate: {
            items: {
              populate: {
                page: true,
                children: {
                  populate: {
                    page: true
                  }
                }
              }
            }
          }
        },
        footerMenu: {
          populate: {
            items: {
              populate: {
                page: true,
                children: {
                  populate: {
                    page: true
                  }
                }
              }
            }
          }
        },
        defaultSeo: true,
        sponsors: {
          populate: {
            image: true
          }
        }
      }
    });

    // Return the populated data
    return { data: entity, meta };
  },

  async findOne(ctx) {
    // Call the default findOne method
    const { data, meta } = await super.findOne(ctx);

    // Get the global entity with populated menu relations
    const entity = await strapi.entityService.findOne('api::global.global', data.id, {
      populate: {
        mainMenu: {
          populate: {
            items: {
              populate: {
                page: true,
                children: {
                  populate: {
                    page: true
                  }
                }
              }
            }
          }
        },
        footerMenu: {
          populate: {
            items: {
              populate: {
                page: true,
                children: {
                  populate: {
                    page: true
                  }
                }
              }
            }
          }
        },
        defaultSeo: true
      }
    });

    // Return the populated data
    return { data: entity, meta };
  }
}));
