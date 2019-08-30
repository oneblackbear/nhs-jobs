import React from 'react';
import PropTypes from 'prop-types';
import FeedForm from './FeedForm';
import FeedListing from './FeedListing';
import FeedPagination from './FeedPagination';

export default function Feed(props) {
    const {
        filters,
        pagination,
        items,
        onFiltersChange
    } = props;

    return (
        <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-one-third">
                <h3>Filter your results and find the role for you</h3>
                <FeedForm filters={filters}
                          onFiltersChange={onFiltersChange}
                />
            </div>
            <div className="nhsuk-grid-column-two-thirds">
                {!items.length && (
                    <div className="nhsuk-grid-column-full-width nhsuk-promo">
                        <a className="nhsuk-promo__link-wrapper"
                           href="/contact/"
                        >
                            <div className="nhsuk-promo__content">
                                We're sorry but there aren't any vacancies that match your criteria at the moment. You can try a different search or register your interest in a specific role on our <span>contact us</span> page.
                            </div>
                        </a>
                    </div>
                )}
                {items.map((item, key) => (
                    <FeedListing key={key}
                                 item={item} />
                ))}
                <FeedPagination pagination={pagination}
                                onFiltersChange={onFiltersChange}
                />
            </div>
        </div>
    );
}

Feed.propTypes = {
    pagination: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
};
