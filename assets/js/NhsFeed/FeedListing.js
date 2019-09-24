import React from 'react';
import PropTypes from "prop-types";

export default function FeedListing(props) {
    const { item } = props;
    const attributes = {
        job_type: 'Type',
        job_salary: 'Salary',
        job_location: 'Location',
        job_staff_group: 'Staff group',
        job_employer: 'Employer',
        job_closedate: 'Close date',
    };

    return (
        <div className="nhsuk-grid-column-full-width nhsuk-promo"
             data-id={ item.id }>
            <a className="nhsuk-promo__link-wrapper"
               href={item.job_url}
               target="_blank"
               rel="noopener noreferrer">
                <div className="nhsuk-promo__content">
                    <h2 className="nhsuk-promo__heading">
                        {item.job_title + ' - ' + item.job_reference}
                    </h2>
                    <dl className="nhsuk-summary-list">
                        {Object.entries(attributes).map(([name, title], key) => (
                            <div
                                key={key}
                                className="nhsuk-summary-list__row"
                            >
                                <dt className="nhsuk-summary-list__key">
                                    {title}
                                </dt>
                                <dd className="nhsuk-summary-list__value">
                                    {item[name]}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="nhsuk-action-link">
                        <span className="nhsuk-action-link__link">
                            <svg className="nhsuk-icon nhsuk-icon__arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
                            </svg>
                            <span className="nhsuk-action-link__text">View Vacancy</span>
                        </span>
                    </div>

                    {/*<span className="nhsuk-button">Read more</span>*/}
                    {/*<p class="nhsuk-promo__description">{item.job_description}</p>*/}
                </div>
            </a>
        </div>
    );
}

FeedListing.propTypes = {
    item: PropTypes.object.isRequired,
};
