/**
 * Get tests
 */
getTests()
    .then(({
        data: tests
    }) => {
        const select = document
            .getElementById('tests-select');

        tests.forEach(test => {
            select
                .classList
                .remove('hidden');

            select.add(
                (() => {
                    const option = document.createElement('option');

                    option.text = test.name ?? 'NO_NAME';

                    option.value = test.id;

                    return option;
                })()
            )
        })

        select
            .addEventListener("change", (event) => {
                if(event.target.value){
                    getTest(event.target.value)
                }
            });
    })