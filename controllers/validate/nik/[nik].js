import { withMiddleware } from '../../../lib/auth.js';

async function handler(req, res) {
    const { nik } = req.query;

    // Mock Data (NIK Papua start with 91 or 92)
    // Map prefix to Kab/Kota
    const wilayahMap = {
        '9171': 'Kota Jayapura',
        '9103': 'Kabupaten Jayapura',
        '9105': 'Kabupaten Kepulauan Yapen', // Serui
        '9106': 'Kabupaten Biak Numfor',
        '9110': 'Kabupaten Sarmi',
        '9111': 'Kabupaten Keerom',
        '9120': 'Kabupaten Supiori',
        '9128': 'Kabupaten Mamberamo Raya'
    };

    const prefix = nik.substring(0, 4);
    const kabKota = wilayahMap[prefix];

    if (kabKota || nik.startsWith('91') || nik.startsWith('92')) {
        res.status(200).json({ 
            valid: true, 
            data: { 
                nik, 
                wilayah: kabKota || 'Provinsi Papua', 
                kabKota: kabKota || 'Lainnya',
                status: 'WNI OAP' 
            } 
        });
    } else {
        res.status(404).json({ 
            valid: false, 
            message: 'NIK tidak valid atau bukan berasal dari wilayah Papua' 
        });
    }
}

export default withMiddleware(handler);
