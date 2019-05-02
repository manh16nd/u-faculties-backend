exports.validateQueryArgs = ({page, limit}) => {
    const defaultArgs = {
        page: 1,
        limit: 10,
    }

    const parsedPage = isNaN(+page) ? defaultArgs.page : +page
    const parsedLimit = isNaN(+limit) ? defaultArgs.limit : +limit

    return {
        page: parsedPage,
        limit: parsedLimit,
    }
}
