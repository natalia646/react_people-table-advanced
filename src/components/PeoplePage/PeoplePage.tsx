import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Person } from '../../types';
import { getPeople } from '../../api';
import { PeopleFilters } from './PeopleFilters/PeopleFilters';
import { useSearchParams } from 'react-router-dom';
import { getFilteredPeople } from '../../utils/getFilteredPeople';
import { PeopleTable } from './PeopleTable/PeopleTable';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchParams] = useSearchParams();

  const peopleWithParents = people.map(person => {
    const mother = people.find(m => person.motherName === m.name);
    const father = people.find(f => person.fatherName === f.name);

    return {
      ...person,
      mother,
      father,
    };
  });

  const filteredPeople = getFilteredPeople(peopleWithParents, {
    sex: searchParams.get('sex') || '',
    centeries: searchParams.getAll('centuries') || [],
    query: searchParams.get('query') || '',
    sort: searchParams.get('sort') || null,
    order: searchParams.get('order') || null,
  });

  useEffect(() => {
    setIsLoading(true);

    getPeople()
      .then(data => {
        setPeople(data);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="block">
          <div className="columns is-desktop is-flex-direction-row-reverse">
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters />
            </div>

            <div className="column">
              <div className="box table-container">
                {isError && (
                  <p data-cy="peopleLoadingError" className="has-text-danger">
                    Something went wrong
                  </p>
                )}

                {!isLoading && people.length === 0 && (
                  <p data-cy="noPeopleMessage">
                    There are no people on the server
                  </p>
                )}

                {!isLoading && !isError && (
                  <PeopleTable people={filteredPeople} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
