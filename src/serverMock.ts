import {http, HttpResponse} from 'msw';
import {setupWorker} from 'msw/browser';

import {SearchRequest} from '../lib/queries/search';
import {FacetRequest} from '../lib/queries/facet';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    'Etiam venenatis lobortis nunc quis vehicula. Mauris efficitur, odio ut eleifend tempus, ' +
    'felis elit fringilla nisi, ut aliquam ligula nunc ut purus. Nullam id interdum lorem, ' +
    'eget tristique elit. Vestibulum laoreet arcu ante, vitae euismod ante fermentum at. ' +
    'Cras suscipit, nibh vel finibus convallis, neque nulla interdum urna, ' +
    'sed vulputate ipsum enim vel tortor. Donec sit amet turpis eget lacus sodales convallis ' +
    'sit amet sit amet mauris. Fusce nec vestibulum nisi, id elementum erat. ' +
    'Maecenas pretium viverra metus vel lobortis. Praesent neque augue, auctor vel bibendum quis, ' +
    'rhoncus et elit. Etiam vitae sapien ut purus venenatis tempus. Sed id ornare lectus.'

const OCCUPATION_FACET_VALUES = [
    {value: 'Architect', count: 994},
    {value: 'Mechanical Engineer', count: 876},
    {value: 'Web Developer', count: 812},
    {value: 'Doctor', count: 782},
    {value: 'Marketing Specialist', count: 760},
    {value: 'Pilot', count: 723},
    {value: 'Operations Manager', count: 712},
    {value: 'Hairdresser', count: 689},
    {value: 'Anesthesiologist', count: 674},
    {value: 'Interior Designer', count: 645},
    {value: 'HR Manager', count: 642},
    {value: 'Nurse', count: 639},
    {value: 'Plumber', count: 555},
    {value: 'Economist', count: 553},
    {value: 'Supply Chain Analyst', count: 551},
    {value: 'Software Engineer', count: 523},
    {value: 'Software Developer', count: 523},
    {value: 'Chef', count: 478},
    {value: 'Business Analyst', count: 473},
    {value: 'Surgeon', count: 456},
    {value: 'Graphic Designer', count: 435},
    {value: 'Lawyer', count: 432},
    {value: 'Real Estate Agent', count: 431},
    {value: 'Psychologist', count: 412},
    {value: 'Journalist', count: 398},
    {value: 'Dermatologist', count: 389},
    {value: 'Event Planner', count: 374},
    {value: 'Flight Attendant', count: 348},
    {value: 'Data Scientist', count: 331},
    {value: 'Interpreter', count: 321},
    {value: 'Dentist', count: 312},
    {value: 'Recruiter', count: 299},
    {value: 'Photographer', count: 287},
    {value: 'Loan Officer', count: 284},
    {value: 'Social Worker', count: 283},
    {value: 'General Practitioner', count: 267},
    {value: 'Bartender', count: 257},
    {value: 'Veterinarian', count: 249},
    {value: 'Accountant', count: 248},
    {value: 'Logistics Coordinator', count: 218},
    {value: 'Statistician', count: 211},
    {value: 'Electrician', count: 192},
    {value: 'Translator', count: 176},
    {value: 'UX Designer', count: 135},
    {value: 'Teacher', count: 115},
    {value: 'Civil Engineer', count: 89}
];

const CATEGORY_FACET_VALUES = [
    {
        name: 'Electronics',
        value: 'electronics',
        count: 320,
        children: [
            {
                name: 'Computers',
                value: 'computers',
                count: 180,
                children: [
                    {
                        name: 'Laptops',
                        value: 'laptops',
                        count: 110,
                        children: [
                            {
                                name: 'Ultrabooks',
                                value: 'ultrabooks',
                                count: 50,
                            },
                            {
                                name: 'Gaming Laptops',
                                value: 'gaming-laptops',
                                count: 40,
                            },
                            {
                                name: '2-in-1',
                                value: '2-in-1',
                                count: 20,
                            },
                        ],
                    },
                    {
                        name: 'Desktops',
                        value: 'desktops',
                        count: 70,
                        children: [
                            {
                                name: 'Gaming Desktops',
                                value: 'gaming-desktops',
                                count: 30,
                            },
                            {
                                name: 'All-in-One',
                                value: 'all-in-one',
                                count: 25,
                            },
                            {
                                name: 'Workstations',
                                value: 'workstations',
                                count: 15,
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Mobile Devices',
                value: 'mobile-devices',
                count: 140,
                children: [
                    {
                        name: 'Smartphones',
                        value: 'smartphones',
                        count: 100,
                        children: [
                            {
                                name: 'Android Phones',
                                value: 'android-phones',
                                count: 70,
                            },
                            {
                                name: 'iPhones',
                                value: 'iphones',
                                count: 30,
                            },
                        ],
                    },
                    {
                        name: 'Tablets',
                        value: 'tablets',
                        count: 40,
                        children: [
                            {
                                name: 'Android Tablets',
                                value: 'android-tablets',
                                count: 25,
                            },
                            {
                                name: 'iPad',
                                value: 'ipad',
                                count: 15,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: 'Clothing',
        value: 'clothing',
        count: 500,
        children: [
            {
                name: 'Men',
                value: 'men',
                count: 260,
                children: [
                    {
                        name: 'Tops',
                        value: 'tops-men',
                        count: 130,
                        children: [
                            {
                                name: 'T-Shirts',
                                value: 'tshirts-men',
                                count: 60,
                            },
                            {
                                name: 'Shirts',
                                value: 'shirts-men',
                                count: 40,
                            },
                            {
                                name: 'Sweaters',
                                value: 'sweaters-men',
                                count: 30,
                            },
                        ],
                    },
                    {
                        name: 'Bottoms',
                        value: 'bottoms-men',
                        count: 130,
                        children: [
                            {
                                name: 'Jeans',
                                value: 'jeans-men',
                                count: 70,
                            },
                            {
                                name: 'Chinos',
                                value: 'chinos-men',
                                count: 40,
                            },
                            {
                                name: 'Shorts',
                                value: 'shorts-men',
                                count: 20,
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Women',
                value: 'women',
                count: 240,
                children: [
                    {
                        name: 'Dresses',
                        value: 'dresses',
                        count: 100,
                        children: [
                            {
                                name: 'Casual Dresses',
                                value: 'casual-dresses',
                                count: 50,
                            },
                            {
                                name: 'Evening Dresses',
                                value: 'evening-dresses',
                                count: 30,
                            },
                            {
                                name: 'Summer Dresses',
                                value: 'summer-dresses',
                                count: 20,
                            },
                        ],
                    },
                    {
                        name: 'Tops',
                        value: 'tops-women',
                        count: 140,
                        children: [
                            {
                                name: 'Blouses',
                                value: 'blouses',
                                count: 60,
                            },
                            {
                                name: 'T-Shirts',
                                value: 'tshirts-women',
                                count: 50,
                            },
                            {
                                name: 'Cardigans',
                                value: 'cardigans',
                                count: 30,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: 'Home & Garden',
        value: 'home-garden',
        count: 220,
        children: [
            {
                name: 'Furniture',
                value: 'furniture',
                count: 100,
                children: [
                    {
                        name: 'Living Room',
                        value: 'living-room',
                        count: 50,
                        children: [
                            {
                                name: 'Sofas',
                                value: 'sofas',
                                count: 25,
                            },
                            {
                                name: 'Coffee Tables',
                                value: 'coffee-tables',
                                count: 15,
                            },
                            {
                                name: 'TV Stands',
                                value: 'tv-stands',
                                count: 10,
                            },
                        ],
                    },
                    {
                        name: 'Bedroom',
                        value: 'bedroom',
                        count: 50,
                        children: [
                            {
                                name: 'Beds',
                                value: 'beds',
                                count: 30,
                            },
                            {
                                name: 'Wardrobes',
                                value: 'wardrobes',
                                count: 20,
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Kitchen',
                value: 'kitchen',
                count: 70,
                children: [
                    {
                        name: 'Cookware',
                        value: 'cookware',
                        count: 30,
                    },
                    {
                        name: 'Appliances',
                        value: 'kitchen-appliances',
                        count: 25,
                    },
                    {
                        name: 'Utensils',
                        value: 'kitchen-utensils',
                        count: 15,
                    },
                ],
            },
            {
                name: 'Garden',
                value: 'garden',
                count: 50,
                children: [
                    {
                        name: 'Plants',
                        value: 'plants',
                        count: 25,
                        children: [
                            {
                                name: 'Indoor Plants',
                                value: 'indoor-plants',
                                count: 15,
                            },
                            {
                                name: 'Outdoor Plants',
                                value: 'outdoor-plants',
                                count: 10,
                            },
                        ],
                    },
                    {
                        name: 'Tools',
                        value: 'garden-tools',
                        count: 25,
                        children: [
                            {
                                name: 'Hand Tools',
                                value: 'hand-tools',
                                count: 15,
                            },
                            {
                                name: 'Power Tools',
                                value: 'power-tools',
                                count: 10,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: 'Sports & Outdoors',
        value: 'sports-outdoors',
        count: 190,
        children: [
            {
                name: 'Fitness',
                value: 'fitness',
                count: 90,
                children: [
                    {
                        name: 'Yoga',
                        value: 'yoga',
                        count: 40,
                    },
                    {
                        name: 'Strength Training',
                        value: 'strength-training',
                        count: 50,
                    },
                ],
            },
            {
                name: 'Outdoor Recreation',
                value: 'outdoor-recreation',
                count: 100,
                children: [
                    {
                        name: 'Camping',
                        value: 'camping',
                        count: 60,
                        children: [
                            {
                                name: 'Tents',
                                value: 'tents',
                                count: 30,
                            },
                            {
                                name: 'Sleeping Bags',
                                value: 'sleeping-bags',
                                count: 20,
                            },
                            {
                                name: 'Backpacks',
                                value: 'camping-backpacks',
                                count: 10,
                            },
                        ],
                    },
                    {
                        name: 'Hiking',
                        value: 'hiking',
                        count: 40,
                        children: [
                            {
                                name: 'Boots',
                                value: 'hiking-boots',
                                count: 20,
                            },
                            {
                                name: 'Poles',
                                value: 'hiking-poles',
                                count: 10,
                            },
                            {
                                name: 'Hydration Packs',
                                value: 'hydration-packs',
                                count: 10,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export default setupWorker(
    http.post<{}, SearchRequest>('https://example.org/api/datasets/example/search', async ({request}) => searchResolver(await request.json())),
    http.post<{}, FacetRequest>('https://example.org/api/datasets/example/facet', async ({request}) => facetResolver(await request.json())),
    http.get('https://example.org/api/datasets/example/facets', facetsResolver),
    http.get<{id: string}>('https://example.org/api/datasets/example/details/:id', ({params}) => detailsResolver(params.id)),
);

function searchResolver({offset, limit}: SearchRequest) {
    const items = [...Array(limit).keys()].map(i => {
        const id = offset + i + 1;
        return {
            id,
            title: `Item ${id}`,
            description: LOREM_IPSUM,
            tags: ['tag1', 'tag2', 'tag3']
        };
    });

    return HttpResponse.json({amount: 50, items});
}

function facetResolver({name}: FacetRequest) {
    switch (name) {
        case 'occupation':
            return HttpResponse.json(OCCUPATION_FACET_VALUES);
        case 'category':
            return HttpResponse.json(CATEGORY_FACET_VALUES);
    }
}

function facetsResolver() {
    return HttpResponse.json([
        {type: 'range', property: 'year', name: 'Year', min: 1900, max: 2024, step: 1},
        {type: 'text', property: 'occupation', name: 'Occupation'},
        {type: 'text', property: 'category', name: 'Category'},
    ]);
}

function detailsResolver(id: string) {
    return HttpResponse.json({
        item_id: id,
        item_data: [{
            type: 'list',
            value: {
                title: `Item ${id}`,
                description: LOREM_IPSUM,
            },
        }]
    });
}
