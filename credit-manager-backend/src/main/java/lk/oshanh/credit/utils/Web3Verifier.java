package lk.oshanh.credit.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.crypto.Hash;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.util.Arrays;

@Component
public class Web3Verifier {
    private static final Logger logger = LoggerFactory.getLogger(Web3Verifier.class);


    public static boolean verifySignature(String address, String message, String signature) {
        try {
            logger.debug("Verifying signature for address: {}", address);
            logger.debug("Message to verify: {}", message);
            logger.debug("Signature to verify: {}", signature);

            byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
            byte[] signatureBytes = Numeric.hexStringToByteArray(signature);

            if (signatureBytes.length != 65) {
                logger.error("Invalid signature length: {}", signatureBytes.length);
                return false;
            }

            byte[] r = new byte[32];
            byte[] s = new byte[32];
            byte v = signatureBytes[64];

            System.arraycopy(signatureBytes, 0, r, 0, 32);
            System.arraycopy(signatureBytes, 32, s, 0, 32);

            logger.debug("Signature components - v: {}, r: {}, s: {}",
                    v,
                    Numeric.toHexString(r),
                    Numeric.toHexString(s));

            // Get the message hash that was signed
            byte[] messageHash = Sign.getEthereumMessageHash(messageBytes);
            logger.debug("Message hash: {}", Numeric.toHexString(messageHash));

            // Try all possible recovery IDs
            for (int i = 0; i < 4; i++) {
                try {
                    String recoveredAddress = "0x" + Keys.getAddress(Sign.recoverFromSignature(i, new ECDSASignature(
                            Numeric.toBigInt(r),
                            Numeric.toBigInt(s)
                    ), messageHash));

                    logger.debug("Recovered address (v={}): {}", i, recoveredAddress);

                    if (recoveredAddress.equalsIgnoreCase(address)) {
                        logger.debug("Found matching address with recovery ID: {}", i);
                        return true;
                    }
                } catch (Exception e) {
                    logger.debug("Failed to recover address with recovery ID: {}", i);
                }
            }

            logger.error("No matching address found for any recovery ID");
            return false;
        } catch (Exception e) {
            logger.error("Error verifying signature", e);
            return false;
        }
    }

////
//    public static boolean verifySignature(String address, String message, String signature) {
//        System.out.println("\n========== VERIFY SIGNATURE START ==========");
//        System.out.println("Provided Address     : " + address);
//        System.out.println("Original Message     : " + message);
//        System.out.println("Signature (hex)      : " + signature);
//
//        // Step 1: Add Ethereum message prefix
//        String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
//        String prefixedMessage = prefix + message;
//
//        System.out.println("Prefix              : " + prefix);
//        System.out.println("Prefixed Message    : " + prefixedMessage);
//        System.out.println("Prefixed Message Hex: " + Numeric.toHexString(prefixedMessage.getBytes(StandardCharsets.UTF_8)));
//
//        // Step 2: Hash it (keccak256)
//        byte[] msgHash = Hash.sha3(prefixedMessage.getBytes(StandardCharsets.UTF_8));
//        System.out.println("Message Hash        : " + Numeric.toHexString(msgHash));
//
//        // Step 3: Decode signature into r, s, v
//        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
//        if (signatureBytes.length != 65) {
//            System.out.println("Invalid signature length: " + signatureBytes.length);
//            return false;
//        }
//
//        byte v = signatureBytes[64];
//        if (v < 27) v += 27;
//
//        byte[] r = Arrays.copyOfRange(signatureBytes, 0, 32);
//        byte[] s = Arrays.copyOfRange(signatureBytes, 32, 64);
//
//        System.out.println("Signature r (hex)   : " + Numeric.toHexString(r));
//        System.out.println("Signature s (hex)   : " + Numeric.toHexString(s));
//        System.out.println("Signature v         : " + v);
//
//        Sign.SignatureData sigData = new Sign.SignatureData(v, r, s);
//
//        // Step 4: Recover public key and address
//        BigInteger publicKey = null;
//        try {
//            //publicKey = Sign.signedPrefixedMessageToKey(msgHash, sigData);
//            publicKey = Sign.signedMessageToKey(msgHash, sigData);
//
//            System.out.println("Recovered PublicKey : " + publicKey.toString(16));
//        } catch (SignatureException e) {
//            System.out.println("Error recovering public key: " + e.getMessage());
//            e.printStackTrace();
//            return false;
//        }
//
//        String recoveredAddress = "0x" + Keys.getAddress(publicKey);
//        System.out.println("Recovered Address   : " + recoveredAddress);
//        System.out.println("Match Result        : " + recoveredAddress.equalsIgnoreCase(address));
//        System.out.println("========== VERIFY SIGNATURE END ===========\n");
//
//        // Step 5: Compare recovered address with provided address
//        return recoveredAddress.equalsIgnoreCase(address);
//    }






}
