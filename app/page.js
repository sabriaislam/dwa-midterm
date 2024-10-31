import data from '../gaza.json'; 
import styles from './page.module.css';

export default async function Home({ searchParams }) {
  const { date } = searchParams;

  var apodData = null;
  var birthdayMatches = [];

  if (date) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY; 
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`,
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      apodData = await response.json();
    } catch (error) {
      console.error('Failed to fetch APOD data:', error);
      apodData = null;
    }
    const monthDay = date.slice(5); 
    birthdayMatches = data.filter(
      (person) => person.dob.slice(5) === monthDay
    );
  }
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }
  return (
    <div className={styles.container}>
      <div className= {styles.intro}>
        <p>NASA's Astronomy Picture of the Day (APOD) captures the vast beauty of the stars, galaxies, and nebulae—distant wonders that remind us of both the scale and fragility of existence in the universe.</p>
        <br></br>
        <p>Enter your birthday to see a dedicated APOD for you</p>
        <br></br>
        <h1>Select a date:</h1>
      </div>
      <div className={styles.formContainer}>
        <form method="GET" action="/">
          <label htmlFor="date"></label>
          <input 
            type="date"
            id="date"
            name="date"
            defaultValue={date || ''}
            required
          />
        <div>
          <button className={styles.button}type="submit">Get Info</button>
        </div>
        </form>
      </div>
    
      {apodData && (
        <div className={styles.apodContainer}>
          <h2 className={styles.apodTitle}>{formatDate(apodData.date)} {apodData.title}</h2>
          <img className={styles.image}
            src={apodData.url}
            alt={apodData.title}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
      {birthdayMatches.length > 0 ? (
        <div className={styles.listNameContainer}>
<h2>Isn't it a beautiful picture? I'd also like to dedicate it to those in Gaza who shared this birthday but were killed during the ongoing genocide. </h2>       
          <ul>
            {birthdayMatches.map((person) => (
              <li key={person.id}>{person.en_name} | {formatDate(person.dob)} </li>
            ))}
          </ul>
        </div>
      ) : (
        date && <p>No birthday matches found for this date.</p>
      )}
    </div>
  );
}
