import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { TrophySpin } from 'react-loading-indicators';

const SERVER_API = import.meta.env.VITE_SERVER_API;

function App() {
  const [formData, setFormData] = useState({ CertNo: '' });
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGet = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_API}${formData.CertNo}`);
      setIntern(res.data);
      setLoading(false)
    } catch (err) {
      setIntern({ error: err.response?.data?.error || 'Fetch failed' });
    }
  };

  // Extract Google Drive file ID from the URL
  const getDriveEmbedLink = (url) => {
    const match = url.match(/\/d\/(.+?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  return (
    <>
      <h2>Techsnapie Solutions - Intern Management Panel</h2>
      <form className='form-space' onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="CertNo"
          placeholder="Certificate No"
          onChange={handleChange}
        />
        <div  className='btn-box' style={{ marginTop: '1rem' }}>
          <button type="button" onClick={handleGet}>Check for Intern</button>
          {loading ? (
            <TrophySpin color={["#797a1d", "#a2a327", "#cbcc31", "#d6d759"]} size='small' />
          ) : (<></>)}
        </div>
      </form>

      {intern && (
        <div className="result-box">
          {intern.error ? (
            <p className="error">{intern.error}</p>
          ) : (
            <>
            <div className='res-bx'>
              <p><strong>Name:</strong> {intern.NAME}</p>
              <p><strong>Course:</strong> {intern.COURSE_NAME}</p>
              <p><strong>Batch:</strong> {intern.Batch}</p>
            </div>
              {intern.MergedDocURL && getDriveEmbedLink(intern.MergedDocURL) && (
                <div className="pdf-preview">
                  <h4>Certificate Preview</h4>
                  <iframe
                    src={getDriveEmbedLink(intern.MergedDocURL)}
                    title="Certificate PDF"
                    allow="autoplay"
                    className='cert-iframe'
                    width="580px"
                    height="420px"
                  ></iframe>
                </div>
              )}
            <div className='res-bx'>
              <p>
                This is to certify that <strong>{intern.NAME}</strong> has successfully completed training in <strong>{intern.COURSE_NAME}</strong> at Techsnapie Solutions. <br />
                Certificate ID: <strong>{intern.CertNo}</strong> <br />
                We confirm that the above-mentioned individual was a registered intern in our organization and has fulfilled all requirements of the program.</p>
            </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
