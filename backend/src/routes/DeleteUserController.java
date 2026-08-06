@RestController
@RequestMapping("/delete-user")
public class DeleteUserController {

    private final UserRepository userRepository;

    public DeleteUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur introuvable");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}