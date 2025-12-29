import React, { useState } from 'react';
import './SearchForm.css';

interface SearchFormProps {
    onSearch: (data: { firstName: string; lastName: string; company: string }) => void;
    isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!company.trim()) newErrors.company = 'L\'entreprise est requise';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        onSearch({ firstName: firstName.trim(), lastName: lastName.trim(), company: company.trim() });
    };

    return (
        <form className="search-form fade-in" onSubmit={handleSubmit}>
            <h2>Analyse de Profil</h2>
            <p className="search-form-subtitle">
                Générez un rapport professionnel complet avec scoring de fiabilité multi-sources
            </p>

            <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({...errors, firstName: ''})}}
                    placeholder="ex: Jean"
                    disabled={isLoading}
                    aria-invalid={!!errors.firstName}
                    className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({...errors, lastName: ''})}}
                    placeholder="ex: Dupont"
                    disabled={isLoading}
                    aria-invalid={!!errors.lastName}
                    className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="company">Entreprise</label>
                <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => { setCompany(e.target.value); if (errors.company) setErrors({...errors, company: ''})}}
                    placeholder="ex: Acme SARL"
                    disabled={isLoading}
                    aria-invalid={!!errors.company}
                    className={errors.company ? 'error' : ''}
                />
                {errors.company && <span className="error-text">{errors.company}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading && <span className="loading-spinner-btn"></span>}
                {isLoading ? 'Analyse en cours...' : 'Analyser le Profil'}
            </button>
        </form>
    );
};
