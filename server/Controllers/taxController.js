import { calculateTaxProfile } from '../Services/TaxService.js';
import { TaxProfile } from '../Models/TaxProfile.js';
import { User } from '../Models/User.js';

export const getTaxRecommendation = async (req, res, next) => {
    try {
        const financialYear = req.params.year || '2023-2024';
        const user = await User.findById(req.user.id);
        
        const calculation = await calculateTaxProfile(req.user.id, user.age, financialYear);

        let taxProfile = await TaxProfile.findOne({ userId: req.user.id, financialYear });
        if (taxProfile) {
            Object.assign(taxProfile, calculation);
        } else {
            taxProfile = new TaxProfile({ userId: req.user.id, ...calculation });
        }
        await taxProfile.save();

        res.status(200).json({ success: true, payload: taxProfile });
    } catch (err) {
        next(err);
    }
};
