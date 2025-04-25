package lk.oshanh.credit.utils;

import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.crypto.Hash;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.util.Arrays;

public class Web3Verifier {

//    public static boolean verifySignature(String address, String message, String signature) {
//        System.out.println("\n\naddress = "+address+"\nmessage = "+message+"\nsignature = "+signature+"\n\n");
//
//        //String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
//        //System.out.println("\n\nprefix = "+prefix+"\n\n");
//
//        //String prefixedMessage = prefix + message.trim();
//        //System.out.println("\n\nprefixedMessage = "+prefixedMessage+"\n\n");
//
//
//        //byte[] msgHash = Hash.sha3(prefixedMessage.getBytes());
//        //byte[] msgHash = Hash.sha3(prefixedMessage.getBytes(StandardCharsets.UTF_8));
//        byte[] msgHash = Hash.sha3(message.getBytes(StandardCharsets.UTF_8));
//
//
//        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
//        if (signatureBytes.length != 65) return false;
//
//        byte v = signatureBytes[64];
//        if (v < 27) v += 27;
//
//        Sign.SignatureData sigData = new Sign.SignatureData(
//                v,
//                Arrays.copyOfRange(signatureBytes, 0, 32),
//                Arrays.copyOfRange(signatureBytes, 32, 64)
//        );
//
//        System.out.println("\n\nsigData = "+sigData+"\n\n");
//        System.out.println("\n\nsigData v = "+sigData.getV()[0]+"\nsigData r = "+Numeric.toHexString(sigData.getR())+"\nsigData s = "+Numeric.toHexString(sigData.getS())+"\n\n");
//
//
//        BigInteger pubKeyRecovered;
//        try {
//            //pubKeyRecovered = Sign.signedPrefixedMessageToKey(msgHash, sigData);
//            //pubKeyRecovered = Sign.signedMessageHashToKey(msgHash,sigData);
//            //pubKeyRecovered = Sign.signedMessageToKey(msgHash,sigData);
//              pubKeyRecovered = Sign.signedMessageToKey(message.getBytes(StandardCharsets.UTF_8), sigData);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//
//        String recoveredAddress = "0x" + Keys.getAddress(pubKeyRecovered);
//        System.out.println("\n\nrecoveredAddress = "+recoveredAddress+"\n\n");
//
//        System.out.println("\nMessage length: " + message.length());
//        System.out.println("\nMessage hex: " + Numeric.toHexString(message.getBytes(StandardCharsets.UTF_8)));
//        System.out.println("\nPrefixed message hex: " + Numeric.toHexString(message.getBytes(StandardCharsets.UTF_8)));
//        System.out.println("\nMessage hash: " + Numeric.toHexString(msgHash));
//
//        return recoveredAddress.equalsIgnoreCase(address);
//        //return true;
//    }

    public static boolean verifySignature(String address, String message, String signature) {
        System.out.println("\n========== VERIFY SIGNATURE START ==========");
        System.out.println("Provided Address     : " + address);
        System.out.println("Original Message     : " + message);
        System.out.println("Signature (hex)      : " + signature);

        // Step 1: Add Ethereum message prefix
        String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
        String prefixedMessage = prefix + message;

        System.out.println("Prefix              : " + prefix);
        System.out.println("Prefixed Message    : " + prefixedMessage);
        System.out.println("Prefixed Message Hex: " + Numeric.toHexString(prefixedMessage.getBytes(StandardCharsets.UTF_8)));

        // Step 2: Hash it (keccak256)
        byte[] msgHash = Hash.sha3(prefixedMessage.getBytes(StandardCharsets.UTF_8));
        System.out.println("Message Hash        : " + Numeric.toHexString(msgHash));

        // Step 3: Decode signature into r, s, v
        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
        if (signatureBytes.length != 65) {
            System.out.println("Invalid signature length: " + signatureBytes.length);
            return false;
        }

        byte v = signatureBytes[64];
        if (v < 27) v += 27;

        byte[] r = Arrays.copyOfRange(signatureBytes, 0, 32);
        byte[] s = Arrays.copyOfRange(signatureBytes, 32, 64);

        System.out.println("Signature r (hex)   : " + Numeric.toHexString(r));
        System.out.println("Signature s (hex)   : " + Numeric.toHexString(s));
        System.out.println("Signature v         : " + v);

        Sign.SignatureData sigData = new Sign.SignatureData(v, r, s);

        // Step 4: Recover public key and address
        BigInteger publicKey = null;
        try {
            //publicKey = Sign.signedPrefixedMessageToKey(msgHash, sigData);
            publicKey = Sign.signedMessageToKey(msgHash, sigData);

            System.out.println("Recovered PublicKey : " + publicKey.toString(16));
        } catch (SignatureException e) {
            System.out.println("Error recovering public key: " + e.getMessage());
            e.printStackTrace();
            return false;
        }

        String recoveredAddress = "0x" + Keys.getAddress(publicKey);
        System.out.println("Recovered Address   : " + recoveredAddress);
        System.out.println("Match Result        : " + recoveredAddress.equalsIgnoreCase(address));
        System.out.println("========== VERIFY SIGNATURE END ===========\n");

        // Step 5: Compare recovered address with provided address
        return recoveredAddress.equalsIgnoreCase(address);
    }






}
