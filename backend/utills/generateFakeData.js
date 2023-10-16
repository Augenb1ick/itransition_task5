const { fakerRU, fakerFR, fakerDE } = require('@faker-js/faker');
const fakerFunctions = {
    Russia: fakerRU,
    France: fakerFR,
    Germany: fakerDE,
};

const fakerUsersNumbers = {
    Russia: {
        min: 0,
        max: 10000000,
    },
    France: {
        min: 10000001,
        max: 20000000,
    },
    Germany: {
        min: 20000001,
        max: 30000000,
    },
};

const fakerUsersIdPrefix = {
    Russia: 'RU',
    France: 'FR',
    Germany: 'DE',
};

const generateFakeData = (location, seed, page, errors) => {
    let users = [];

    const selectedFaker = fakerFunctions[location];

    for (let i = 0; i < 9 + Number(page); i++) {
        for (const faker of [selectedFaker]) {
            const finalSeed = Number(seed) + i;
            faker.seed(finalSeed);

            const randomCyrillicChar = String.fromCharCode(
                faker.number.int({ min: 1073, max: 1093 })
            );

            const randomLatinChar = String.fromCharCode(
                faker.number.int({ min: 97, max: 112 })
            );

            const defineChar = (location) => {
                return location === 'Russia'
                    ? randomCyrillicChar
                    : randomLatinChar;
            };

            function applyErrors(inputs, errorRate) {
                let numberOfErrors = Math.floor(errorRate);

                const additionalErrorProbability = errorRate - numberOfErrors;

                if (
                    faker.number.float({
                        min: 0,
                        max: 1,
                        precision: 0.01,
                    }) < additionalErrorProbability
                ) {
                    numberOfErrors += 1;
                }

                let updatedInputs = [...inputs];

                for (let i = 0; i < numberOfErrors; i++) {
                    let tempInputs = [...updatedInputs];
                    let selectedIndex = faker.number.int({
                        max: tempInputs.length - 1,
                    });
                    let result = tempInputs[selectedIndex];

                    let chosenErrorType = faker.helpers.arrayElement([
                        'delete',
                        'insert',
                        'swap',
                    ]);

                    switch (chosenErrorType) {
                        case 'delete':
                            result = applyDeletionErrors(result);
                            break;
                        case 'insert':
                            result = applyInsertionErrors(result);
                            break;
                        case 'swap':
                            result = applySwapErrors(result);
                            break;
                        default:
                            result = applyDeletionErrors(result);
                            break;
                    }

                    updatedInputs[selectedIndex] = result;
                }
                return updatedInputs;
            }

            function applyDeletionErrors(input) {
                if (input.length < 3) {
                    return input;
                }
                let result = input;
                const index = faker.number.int({
                    min: 0,
                    max: result.length - 1,
                });
                result = result.slice(0, index) + result.slice(index + 1);
                return result;
            }

            function applyInsertionErrors(input) {
                if (input.length < 3) {
                    return input;
                }
                let result = input;

                const lettersCount = (input.match(/[a-zA-Zа-яА-Я]/g) || [])
                    .length;

                const numbersCount = (input.match(/[0-9]/g) || []).length;

                const index = faker.number.int({
                    min: 0,
                    max: result.length - 1,
                });

                const randomLetter = defineChar(location);
                const randomInt = String.fromCharCode(
                    faker.number.int({ min: 48, max: 57 })
                );
                let randomChar;

                if (lettersCount > numbersCount) {
                    randomChar = randomLetter;
                } else {
                    randomChar = randomInt;
                }

                result =
                    result.slice(0, index) + randomChar + result.slice(index);
                return result;
            }

            function applySwapErrors(input) {
                if (input.length < 3) {
                    return input;
                }
                let result = input;
                const index = faker.number.int({
                    max: result.length - 1,
                });

                if (index === result.length - 1) {
                    result = result.slice(0, index) + result[index];
                } else {
                    result =
                        result.slice(0, index) +
                        result[index + 1] +
                        result[index] +
                        (result.slice(index + 2) || '');
                }
                return result;
            }

            const selectedMax = fakerUsersNumbers[location].max;
            const selectedMin = fakerUsersNumbers[location].min;

            faker.seed(finalSeed);
            const number = faker.number
                .int({ min: selectedMin, max: selectedMax })
                .toString();

            faker.seed(finalSeed);
            const generateId = (location) => {
                const prefix = fakerUsersIdPrefix[location];
                const id = faker.string.uuid();
                return `${prefix}-${id}`;
            };
            const id = generateId(location);
            const fullName = faker.person.fullName();

            faker.seed(finalSeed);
            const cell = faker.phone.number();
            const state = faker.location.state();

            faker.seed(finalSeed);
            const city = faker.location.city();

            faker.seed(finalSeed);
            const street = faker.location.street();

            faker.seed(finalSeed);
            const house = faker.number.int({ max: 500 }).toString();

            faker.seed(finalSeed);
            const secondaryAdress = faker.datatype.boolean()
                ? faker.location.secondaryAddress()
                : '';

            const fakeDataArr = [
                number,
                id,
                fullName,
                cell,
                state,
                city,
                street,
                house,
                secondaryAdress,
            ];

            const filteredFakeDataArr = fakeDataArr.filter(
                (item) => item !== ''
            );
            const dataToSendArr = applyErrors(
                filteredFakeDataArr,
                Number(errors)
            );

            const address = `${dataToSendArr[4]}, ${dataToSendArr[5]}, ${
                dataToSendArr[6]
            }, ${dataToSendArr[7]}, ${
                dataToSendArr[8] ? dataToSendArr[8] : ''
            }`;

            const usersData = {
                num: dataToSendArr[0],
                id: dataToSendArr[1],
                fullName: dataToSendArr[2],
                cell: dataToSendArr[3],
                address,
            };

            users.push(usersData);
        }
    }

    return users;
};

module.exports = generateFakeData;
